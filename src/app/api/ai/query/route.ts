/**
 * @fileOverview Secure Next.js API route for AI query processing.
 *
 * POST /api/ai/query
 *
 * 1. Validates the request body (queryText, tenantId, businessId, userId, role)
 * 2. Fetches RBAC-filtered business context from Firebase Data Connect (SQL Connect)
 * 3. Enforces a resilient LLM fallback pipeline to mitigate 429 rate limits
 * 4. Logs the query/response to the AiQuery table
 * 5. Returns the AI response to the client
 *
 * SECURITY:
 * - Server-side only — the OpenRouter API key never reaches the client
 * - RBAC filtering happens BEFORE the context reaches the LLM
 * - The system prompt enforces read-only containment even if context leaks
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildSystemMessage } from '@/ai/system-prompt';
import { fetchTenantContext } from '@/ai/ai-context';
import { createAiQuery } from '@dataconnect/generated';

// ---------------------------------------------------------------------------
// Request Validation Schema
// ---------------------------------------------------------------------------

const QueryRequestSchema = z.object({
  queryText: z
    .string()
    .min(1, 'Query text is required')
    .max(2000, 'Query text must be under 2000 characters'),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  businessId: z.string().min(1, 'Business ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum([
    'Platform Super Admin',
    'Business Owner',
    'Manager',
    'Accountant',
    'HR Officer',
    'Staff',
    'Viewer',
  ]),
  userName: z.string().optional().default('Unknown User'),
});

// ---------------------------------------------------------------------------
// Resilient LLM Fallback Pipeline Configuration
// ---------------------------------------------------------------------------

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Resilient list of general-purpose free models on OpenRouter
const MODELS_PIPELINE = [
  'google/gemma-4-31b-it:free',            // Primary
  'openai/gpt-oss-120b:free',             // Secondary
  'meta-llama/llama-3-8b-instruct:free',   // Fast Backup
] as const;

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ------------------------------------------------------------------
    // 1. Validate environment
    // ------------------------------------------------------------------
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('[AI Query] OPENROUTER_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact the administrator.' },
        { status: 503 },
      );
    }

    // ------------------------------------------------------------------
    // 2. Parse and validate request body
    // ------------------------------------------------------------------
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 },
      );
    }

    const validation = QueryRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { queryText, tenantId, businessId, userId, role } = validation.data;

    console.log(
      `[AI Query] Processing query for tenant=${tenantId} business=${businessId} role=${role}`,
    );

    // ------------------------------------------------------------------
    // 3. Fetch RBAC-filtered business context from Data Connect
    // ------------------------------------------------------------------
    let tenantContext;
    try {
      tenantContext = await fetchTenantContext(tenantId, businessId, role);
    } catch (contextError) {
      console.error('[AI Query] Failed to fetch tenant context:', contextError);
      return NextResponse.json(
        { error: 'Failed to retrieve business data. Please try again later.' },
        { status: 500 },
      );
    }

    // ------------------------------------------------------------------
    // 4. Build the system message with context
    // ------------------------------------------------------------------
    const systemMessage = buildSystemMessage(tenantContext);

    // ------------------------------------------------------------------
    // 5. Call OpenRouter API with Fallback Execution Pipeline (Mitigate 429s)
    // ------------------------------------------------------------------
    let aiResponseText = '';
    let chosenModel = '';
    let lastError: Error | null = null;

    for (const model of MODELS_PIPELINE) {
      try {
        console.log(`[AI Query] Attempting completion with model: ${model}`);
        const openRouterResponse = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://smarterp.ai',
            'X-Title': 'SmartERP AI Assistant',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: systemMessage,
              },
              {
                role: 'user',
                content: queryText,
              },
            ],
            temperature: 0.2, // Lower temperature for more deterministic, factual output
            max_tokens: 1500,
            top_p: 0.9,
          }),
        });

        // Catch rate limits (429) or gateway timeouts (504, 502, 503)
        if (openRouterResponse.status === 429) {
          console.warn(`[AI Query] Model ${model} is rate limited (429). Falling back...`);
          lastError = new Error(`Model ${model} was rate limited (429).`);
          continue;
        }

        if (!openRouterResponse.ok) {
          const errorBody = await openRouterResponse.text();
          console.warn(
            `[AI Query] Model ${model} returned error status ${openRouterResponse.status}:`,
            errorBody,
          );
          
          lastError = new Error(
            `Model ${model} failed with status ${openRouterResponse.status}: ${errorBody.substring(0, 100)}`
          );

          // Fallback on transient server errors
          if (
            openRouterResponse.status === 408 || // Request Timeout
            openRouterResponse.status === 502 || // Bad Gateway
            openRouterResponse.status === 503 || // Service Unavailable
            openRouterResponse.status === 504    // Gateway Timeout
          ) {
            continue;
          }

          // If it's a fatal client error (400, 401, 403), stop pipeline and throw
          throw lastError;
        }

        const openRouterData = await openRouterResponse.json();
        const responseContent = openRouterData?.choices?.[0]?.message?.content?.trim();

        if (responseContent) {
          aiResponseText = responseContent;
          chosenModel = model;
          break; // Success! Exit the fallback loop.
        } else {
          console.warn(`[AI Query] Model ${model} returned an empty choices payload.`);
          lastError = new Error(`Model ${model} returned empty completion choices.`);
        }
      } catch (fetchError: any) {
        console.error(`[AI Query] Exception during completion attempt with ${model}:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        // Continue loop to try next fallback model
      }
    }

    // Check if the fallback pipeline failed entirely
    if (!aiResponseText) {
      console.error('[AI Query] Fallback pipeline exhausted. All models failed.', lastError);
      return NextResponse.json(
        {
          error: 'AI completion service is currently unavailable. Please try again in a few minutes.',
          details: lastError?.message || 'All models exhausted.',
        },
        { status: 502 },
      );
    }

    // ------------------------------------------------------------------
    // 6. Log query to AiQuery table in Data Connect (Safe and Unauthenticated)
    // ------------------------------------------------------------------
    try {
      await createAiQuery({
        tenantId,
        businessId,
        userId,
        queryText,
        response: aiResponseText.substring(0, 5000), // Cap response size
      });
    } catch (logError) {
      // Non-fatal: log the error but still return the AI response to user
      console.error('[AI Query] Failed to log AI query to database:', logError);
    }

    // ------------------------------------------------------------------
    // 7. Return the response
    // ------------------------------------------------------------------
    const elapsed = Date.now() - startTime;
    console.log(
      `[AI Query] Query resolved successfully using model=${chosenModel} in ${elapsed}ms`,
    );

    return NextResponse.json({
      response: aiResponseText,
      metadata: {
        model: chosenModel,
        role,
        processingTimeMs: elapsed,
        contextModules: Object.keys(tenantContext).filter((k) => k !== 'meta'),
      },
    });
  } catch (unexpectedError) {
    console.error('[AI Query] Unexpected error:', unexpectedError);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 },
    );
  }
}
