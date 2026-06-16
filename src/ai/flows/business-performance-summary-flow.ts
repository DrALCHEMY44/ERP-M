'use server';
/**
 * @fileOverview A Genkit flow for summarizing business performance.
 *
 * - businessPerformanceSummary - A function that handles the business performance summary process.
 * - BusinessPerformanceSummaryInput - The input type for the businessPerformanceSummary function.
 * - BusinessPerformanceSummaryOutput - The return type for the businessPerformanceSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BusinessPerformanceSummaryInputSchema = z.object({
  period: z.string().describe('The period for which to summarize business performance (e.g., "this month", "last quarter", "today", "this week", "last year").'),
  tenantId: z.string().describe('The ID of the current tenant.'),
  businessId: z.string().describe('The ID of the current business.'),
  userId: z.string().describe('The ID of the current user.'),
  userRole: z.string().describe('The role of the current user (e.g., "Business Owner", "Manager", "Accountant").'),
});
export type BusinessPerformanceSummaryInput = z.infer<typeof BusinessPerformanceSummaryInputSchema>;

const BusinessPerformanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the business performance for the specified period.'),
  totalSales: z.number().describe('The total sales amount for the period.').optional(),
  totalExpenses: z.number().describe('The total expenses amount for the period.').optional(),
  profit: z.number().describe('The net profit for the period.').optional(),
  insights: z.array(z.string()).describe('Key insights derived from the performance data.').optional(),
  trends: z.array(z.string()).describe('Observable trends in the business performance over the period.').optional(),
});
export type BusinessPerformanceSummaryOutput = z.infer<typeof BusinessPerformanceSummaryOutputSchema>;

export async function businessPerformanceSummary(input: BusinessPerformanceSummaryInput): Promise<BusinessPerformanceSummaryOutput> {
  return businessPerformanceSummaryFlow(input);
}

// In a real application, you would fetch actual data from Firestore here.
// This is a simulated function to demonstrate the flow.
async function getSimulatedBusinessData(input: BusinessPerformanceSummaryInput) {
  // Implement logic to convert 'period' into start/end dates
  // For simplicity, we'll return static data for now.
  let totalSales = 0;
  let totalExpenses = 0;
  let profit = 0;

  switch (input.period.toLowerCase()) {
    case 'today':
      totalSales = 150000;
      totalExpenses = 80000;
      break;
    case 'this week':
      totalSales = 800000;
      totalExpenses = 450000;
      break;
    case 'this month':
      totalSales = 3500000;
      totalExpenses = 1800000;
      break;
    case 'last quarter':
      totalSales = 10000000;
      totalExpenses = 5000000;
      break;
    case 'last year':
      totalSales = 40000000;
      totalExpenses = 20000000;
      break;
    default:
      totalSales = 500000;
      totalExpenses = 250000;
  }
  profit = totalSales - totalExpenses;

  return {
    totalSales: totalSales,
    totalExpenses: totalExpenses,
    profit: profit,
    period: input.period,
    tenantId: input.tenantId,
    businessId: input.businessId,
    userRole: input.userRole,
  };
}

const businessPerformancePrompt = ai.definePrompt({
  name: 'businessPerformanceSummaryPrompt',
  input: { schema: BusinessPerformanceSummaryInputSchema },
  output: { schema: BusinessPerformanceSummaryOutputSchema },
  prompt: `You are a helpful AI assistant for KoboCore ERP. Your primary goal is to provide concise and accurate summaries of business performance based on the data provided.

Constraints:
- You are read-only and cannot modify any data or perform actions.
- You must strictly respect the user's role and permissions. This user has the role of '{{{userRole}}}'.
- You can only answer based on the current business data for tenant '{{{tenantId}}}' and business '{{{businessId}}}'.
- If the user asks for information outside their permission level, respond: "You do not have permission to access this information."
- If the user asks you to modify data, respond: "I can summarize and report on business information, but I cannot modify records."


Summarize the overall business performance for the period '{{{period}}}' based on the following data. Focus on key financial metrics and provide insights and trends relevant to a Business Owner.

Total Sales: {{totalSales}}
Total Expenses: {{totalExpenses}}
Profit: {{profit}}

Present the summary in a clear and professional manner. Include currency in FCFA.

Remember: "I can only answer based on the data available in your business account and your permission level."`,
});

const businessPerformanceSummaryFlow = ai.defineFlow(
  {
    name: 'businessPerformanceSummaryFlow',
    inputSchema: BusinessPerformanceSummaryInputSchema,
    outputSchema: BusinessPerformanceSummaryOutputSchema,
  },
  async (input) => {
    // In a real application, you would perform Firestore queries here
    // to fetch actual sales, expense, and other relevant data.
    // Ensure these queries are restricted by tenantId and businessId.
    const businessData = await getSimulatedBusinessData(input);

    if (input.userRole !== 'Business Owner') {
      // This is a simplified check. More granular permission checks would be needed.
      return {
        summary: 'You do not have permission to access this information.',
      };
    }

    const { output } = await businessPerformancePrompt({
      ...input,
      ...businessData,
    });

    return output!;
  }
);
