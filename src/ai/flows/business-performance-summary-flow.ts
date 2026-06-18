'use server';
/**
 * @fileOverview Specialized performance summary flow with strict access controls.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BusinessPerformanceSummaryInputSchema = z.object({
  period: z.string().describe('The period for which to summarize performance.'),
  tenantId: z.string().describe('The ID of the current tenant.'),
  businessId: z.string().describe('The ID of the current business.'),
  userId: z.string().describe('The ID of the current user.'),
  userRole: z.string().describe('The role of the current user.'),
});
export type BusinessPerformanceSummaryInput = z.infer<typeof BusinessPerformanceSummaryInputSchema>;

const BusinessPerformanceSummaryOutputSchema = z.object({
  summary: z.string(),
  totalSales: z.number().optional(),
  totalExpenses: z.number().optional(),
  profit: z.number().optional(),
});
export type BusinessPerformanceSummaryOutput = z.infer<typeof BusinessPerformanceSummaryOutputSchema>;

const businessPerformancePrompt = ai.definePrompt({
  name: 'businessPerformanceSummaryPrompt',
  input: { schema: BusinessPerformanceSummaryInputSchema },
  output: { schema: BusinessPerformanceSummaryOutputSchema },
  prompt: `You are an AI Business Consultant. Summarize performance for '{{{period}}}'.
User Role: {{{userRole}}}

PERMISSIONS CHECK:
- Only 'Business Owner' and 'Accountant' can see profit and expense totals.
- If '{{{userRole}}}' is not one of these, you MUST NOT reveal financial totals and instead return: "You do not have permission to access detailed financial performance information."

Data (Simulated):
Sales: 3,500,000 FCFA
Expenses: 1,800,000 FCFA
Profit: 1,700,000 FCFA

Always end with: "I can only answer based on the data available in your business account and your permission level."`,
});

export async function businessPerformanceSummary(input: BusinessPerformanceSummaryInput): Promise<BusinessPerformanceSummaryOutput> {
  const authorized = ['Business Owner', 'Accountant', 'Manager'].includes(input.userRole);
  if (!authorized) {
    return { summary: "You do not have permission to access this information." };
  }
  
  const { output } = await businessPerformancePrompt(input);
  return output!;
}
