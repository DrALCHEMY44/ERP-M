
'use server';
/**
 * @fileOverview An AI assistant flow for providing insights into sales and inventory data.
 * This assistant is STRICTLY read-only and context-aware.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesAndInventoryInsightsInputSchema = z.object({
  question: z.string().describe('The natural language question from the user.'),
  tenantId: z.string().describe('The ID of the tenant the user belongs to.'),
  businessId: z.string().describe('The ID of the business the user is currently operating within.'),
  userRole: z.string().describe('The role of the current user (e.g., Manager, Accountant).'),
  permissions: z.array(z.string()).describe('User permissions.'),
  salesSummary: z.string().optional().describe('Contextual sales data.'),
  lowStockProducts: z.string().optional().describe('Contextual inventory data.'),
  generalBusinessSummary: z.string().optional().describe('Contextual financial data.'),
  userCanViewSales: z.boolean(),
  userCanViewInventory: z.boolean(),
  userCanViewFinancials: z.boolean(),
});
export type SalesAndInventoryInsightsInput = z.infer<typeof SalesAndInventoryInsightsInputSchema>;

const SalesAndInventoryInsightsOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type SalesAndInventoryInsightsOutput = z.infer<typeof SalesAndInventoryInsightsOutputSchema>;

export async function salesAndInventoryInsights(
  input: SalesAndInventoryInsightsInput
): Promise<SalesAndInventoryInsightsOutput> {
  return salesAndInventoryInsightsFlow(input);
}

const salesAndInventoryInsightsPrompt = ai.definePrompt({
  name: 'salesAndInventoryInsightsPrompt',
  input: {schema: SalesAndInventoryInsightsInputSchema},
  output: {schema: SalesAndInventoryInsightsOutputSchema},
  prompt: `You are a read-only AI Assistant for SmartERP AI, designed for Cameroonian SMEs.
Strictly adhere to these guardrails:
1. READ-ONLY: You cannot modify records. If asked, say: "I can summarize and report on business information, but I cannot modify records."
2. MULTI-TENANCY: Only answer based on tenant '{{{tenantId}}}'.
3. PERMISSIONS: Respect role '{{{userRole}}}'. If unauthorized, say: "You do not have permission to access this information."

Available Context:
{{#if salesSummary}}Sales: {{{salesSummary}}}{{/if}}
{{#if lowStockProducts}}Low Stock: {{{lowStockProducts}}}{{/if}}
{{#if generalBusinessSummary}}Finance: {{{generalBusinessSummary}}}{{/if}}

Question: "{{{question}}}"

Always end with: "I can only answer based on the data available in your business account and your permission level."`,
});

const salesAndInventoryInsightsFlow = ai.defineFlow(
  {
    name: 'salesAndInventoryInsightsFlow',
    inputSchema: SalesAndInventoryInsightsInputSchema,
    outputSchema: SalesAndInventoryInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await salesAndInventoryInsightsPrompt(input);
    return output!;
  }
);
