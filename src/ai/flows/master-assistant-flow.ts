'use server';
/**
 * @fileOverview A master Genkit flow that acts as a central dispatcher for the AI assistant.
 * It routes queries to specialized flows or answers general business questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { businessPerformanceSummary } from './business-performance-summary-flow';
import { taskAndActivityReview } from './task-and-activity-review-flow';
import { salesAndInventoryInsights } from './sales-and-inventory-insights-flow';

const MasterAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s natural language question or command.'),
  tenantId: z.string().describe('The current tenant ID.'),
  businessId: z.string().describe('The current business ID.'),
  userId: z.string().describe('The current user ID.'),
  userRole: z.string().describe('The current user role.'),
  permissions: z.array(z.string()).describe('User permissions.'),
});
export type MasterAssistantInput = z.infer<typeof MasterAssistantInputSchema>;

const MasterAssistantOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type MasterAssistantOutput = z.infer<typeof MasterAssistantOutputSchema>;

export async function masterAssistant(input: MasterAssistantInput): Promise<MasterAssistantOutput> {
  return masterAssistantFlow(input);
}

const masterAssistantFlow = ai.defineFlow(
  {
    name: 'masterAssistantFlow',
    inputSchema: MasterAssistantInputSchema,
    outputSchema: MasterAssistantOutputSchema,
  },
  async (input) => {
    const q = input.query.toLowerCase();

    // Routing logic based on query content
    if (q.includes('delete') || q.includes('edit') || q.includes('update') || q.includes('change') || q.includes('modify')) {
      if (!q.includes('log') && !q.includes('status')) { // Status update might be a query about status
        return { response: "I can summarize and report on business information, but I cannot modify records. I am a read-only assistant." };
      }
    }

    if (q.includes('sale') || q.includes('performance') || q.includes('profit') || q.includes('revenue') || q.includes('financial')) {
      const period = q.includes('today') ? 'today' : q.includes('week') ? 'this week' : q.includes('year') ? 'last year' : 'this month';
      const summaryResult = await businessPerformanceSummary({
        period,
        tenantId: input.tenantId,
        businessId: input.businessId,
        userId: input.userId,
        userRole: input.userRole,
      });
      return { response: summaryResult.summary };
    }

    if (q.includes('task') || q.includes('activity') || q.includes('overdue') || q.includes('employee')) {
      const reviewResult = await taskAndActivityReview({
        query: input.query,
        tenantId: input.tenantId,
        businessId: input.businessId,
        userId: input.userId,
        userRole: input.userRole as any,
      });
      return { response: reviewResult.response };
    }

    // Default to sales and inventory insights
    const insightsResult = await salesAndInventoryInsights({
      question: input.query,
      tenantId: input.tenantId,
      businessId: input.businessId,
      userRole: input.userRole,
      permissions: input.permissions,
      userCanViewSales: input.permissions.includes('*') || input.permissions.includes('viewSales'),
      userCanViewInventory: input.permissions.includes('*') || input.permissions.includes('viewInventory'),
      userCanViewFinancials: input.permissions.includes('*') || input.permissions.includes('viewFinance'),
      salesSummary: "Recent sales today total 150,000 FCFA.",
      lowStockProducts: "Riz Long Grain: 15 units (Low Stock).",
      generalBusinessSummary: "Overall profit is healthy at 3,300,000 FCFA for the month.",
    });

    return { response: insightsResult.answer };
  }
);
