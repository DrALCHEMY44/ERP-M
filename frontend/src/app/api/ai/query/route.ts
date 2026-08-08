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
import { mirrorRecord } from '@/lib/server/neon';
import { authorizeRequest } from '@/lib/server/firebase-token';
import { searchDocuments } from '@/lib/server/document-intelligence';
import { FREE_MODEL_PIPELINE } from '@/lib/server/openrouter';

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

// Resilient list of active general-purpose free models on OpenRouter
const MODELS_PIPELINE = FREE_MODEL_PIPELINE;

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
    let authorized;
    try {
      authorized = await authorizeRequest(request);
    } catch (authError) {
      console.warn('[AI Query] Authentication rejected:', authError instanceof Error ? authError.message : authError);
      return NextResponse.json(
        { error: 'Your session is missing or expired. Please sign in again.' },
        { status: 401 },
      );
    }
    // `userId` is the SQL Connect profile ID while `authorized.uid` is the
    // Firebase Auth ID. Company scope is resolved server-side from the verified
    // Firebase identity, so those two different ID namespaces must not be compared.
    if (authorized.tenantId !== tenantId || authorized.businessId !== businessId) {
      return NextResponse.json({ error: 'Cross-company AI access denied.' }, { status: 403 });
    }

    console.log(
      `[AI Query] Processing query for tenant=${tenantId} business=${businessId} role=${role}`,
    );

    // ------------------------------------------------------------------
    // 3. Fetch RBAC-filtered business context from Data Connect
    // ------------------------------------------------------------------
    let tenantContext;
    try {
      tenantContext = await fetchTenantContext(tenantId, businessId, role);
      const evidence = await searchDocuments({ tenantId, businessId, query: queryText, limit: 6 });
      (tenantContext as any).documentEvidence = evidence.map((item: any) => ({
        citation: `[DOC:${item.document_id}#${item.chunk_index}]`,
        title: item.title,
        classification: item.classification,
        content: item.content,
        relevance: Number(item.score || 0),
      }));
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
    const systemMessage = `${buildSystemMessage(tenantContext)}\n\nDOCUMENT CITATION RULES:\nUse retrieved document evidence only when relevant. Cite every document-based factual claim using its exact [DOC:id#chunk] label. Never invent a citation. If no evidence supports the answer, state that clearly.`;

    // ------------------------------------------------------------------
    // 5. Call OpenRouter API with Resilient Fallback Pipeline
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
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002',
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
            temperature: 0.2, // Lower temperature for factual ERP output
            max_tokens: 1500,
            top_p: 0.9,
          }),
        });

        // Handle error status codes (429, 400, 500, etc.) by logging and attempting next fallback
        if (!openRouterResponse.ok) {
          const errorBody = await openRouterResponse.text();
          console.warn(
            `[AI Query] Model ${model} returned error status ${openRouterResponse.status}: ${errorBody.substring(0, 150)}`
          );

          lastError = new Error(
            `Model ${model} failed with HTTP ${openRouterResponse.status}`
          );

          // Continue loop to try next model in pipeline
          continue;
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
    // 6. Log query to AiQuery table in Data Connect (Non-blocking)
    // ------------------------------------------------------------------
    try {
      const aiLog = await createAiQuery({
        tenantId,
        businessId,
        userId,
        queryText,
        response: aiResponseText.substring(0, 5000), // Cap response size
      });
      if (process.env.DUAL_DATABASE_WRITE === 'true') {
        await mirrorRecord({
          entity: 'ai_query',
          operation: 'upsert',
          recordId: aiLog.data.aiQuery_insert.id,
          tenantId,
          businessId,
          payload: {
            id: aiLog.data.aiQuery_insert.id,
            tenantId,
            businessId,
            userId,
            queryText,
            response: aiResponseText.substring(0, 5000),
            timestamp: new Date().toISOString(),
          },
        });
      }
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
