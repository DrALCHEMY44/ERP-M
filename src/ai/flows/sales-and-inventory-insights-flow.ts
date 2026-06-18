'use server';
/**
 * @fileOverview An AI assistant flow for providing insights into sales and inventory data.
 *
 * - salesAndInventoryInsights - A function that handles sales and inventory queries from a manager.
 * - SalesAndInventoryInsightsInput - The input type for the salesAndInventoryInsights function.
 * - SalesAndInventoryInsightsOutput - The return type for the salesAndInventoryInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesAndInventoryInsightsInputSchema = z.object({
  question: z.string().describe('The natural language question from the user.'),
  tenantId: z.string().describe('The ID of the tenant the user belongs to.'),
  businessId: z.string().describe('The ID of the business the user is currently operating within.'),
  userRole: z.string().describe('The role of the current user (e.g., Manager, Accountant).'),
  permissions: z
    .array(z.string())
    .describe('A list of permissions the current user possesses (e.g., viewSales, manageInventory).'),
  salesSummary: z
    .string()
    .optional()
    .describe('A summarized string of recent sales data for the current business, if available and permitted.'),
  lowStockProducts: z
    .string()
    .optional()
    .describe('A summarized string of products currently low in stock for the current business, if available and permitted.'),
  generalBusinessSummary: z
    .string()
    .optional()
    .describe('A summarized string of general business performance (e.g., profit/loss) if available and permitted by role.'),
  userCanViewSales: z
    .boolean()
    .describe('True if the user has explicit permission to view sales data.'),
  userCanViewInventory: z
    .boolean()
    .describe('True if the user has explicit permission to view inventory data.'),
  userCanViewFinancials: z
    .boolean()
    .describe('True if the user has explicit permission to view financial data.'),
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
  prompt: `You are a read-only AI Assistant for SmartERP AI, designed to help managers in Cameroon make informed operational decisions.
Your primary function is to provide summaries, insights, and explanations based *only* on the provided business data.
You must strictly adhere to the following rules:

1.  **Read-Only**: You cannot add, edit, delete data, approve transactions, assign tasks, or modify any records in any way. If asked to do so, respond with: "I can summarize and report on business information, but I cannot modify records."
2.  **Data Isolation**: You must operate strictly within the context of the provided tenantId and businessId.
3.  **Role-Based Access Control**: You must respect the user's userRole and permissions.
4.  **Permission Denied**: If the user asks for information for which they do not have the necessary permissions (even if the data is provided to you) and userCanViewSales, userCanViewInventory, or userCanViewFinancials is false for that data type, respond with: "You do not have permission to access this information."

Here is the contextual data available, based on the user's permissions:

{{#if salesSummary}}
**Recent Sales Summary (Permitted):**
{{{salesSummary}}}
{{/if}}

{{#if lowStockProducts}}
**Low Stock Products (Permitted):**
{{{lowStockProducts}}}
{{/if}}

{{#if generalBusinessSummary}}
**General Business Performance Summary (Permitted):**
{{{generalBusinessSummary}}}
{{/if}}

---
User Question: "{{{question}}}"

Provide a concise and helpful answer based on the available data and the user's permissions. If a specific data type is not provided or the user lacks permission, state that the information is unavailable or unauthorized. Do not fabricate information.

Remember to include this message where appropriate at the end of your answer: "I can only answer based on the data available in your business account and your permission level."
`,
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
