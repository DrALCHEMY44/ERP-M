'use server';
/**
 * @fileOverview Role-aware Genkit flow for task performance and activity logs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskAndActivityReviewInputSchema = z.object({
  query: z.string().describe('The user\'s query.'),
  tenantId: z.string().describe('The current tenant ID.'),
  businessId: z.string().describe('The current business ID.'),
  userId: z.string().describe('The current user ID.'),
  userRole: z.string().describe('The role of the current user.'),
});
export type TaskAndActivityReviewInput = z.infer<typeof TaskAndActivityReviewInputSchema>;

const TaskAndActivityReviewOutputSchema = z.object({
  response: z.string(),
});
export type TaskAndActivityReviewOutput = z.infer<typeof TaskAndActivityReviewOutputSchema>;

const getTasksSummaryTool = ai.defineTool(
  {
    name: 'getTasksSummary',
    description: 'Summary of tasks. Staff can only see their own.',
    inputSchema: z.object({
      tenantId: z.string(),
      businessId: z.string(),
      userRole: z.string(),
      userName: z.string().optional(),
    }),
    outputSchema: z.any(),
  },
  async ({ userRole, userName }) => {
    const restrictedRoles = ['Staff', 'Viewer'];
    if (restrictedRoles.includes(userRole)) {
      return { 
        summary: `Showing assigned tasks for ${userName || 'you'}.`,
        tasks: [{ title: 'Inventory Check', status: 'Ongoing', due: 'Today' }]
      };
    }
    return {
      summary: "Full task overview for the business.",
      overdue: 3,
      ongoing: 5,
      completedToday: 2
    };
  }
);

const taskAndActivityReviewPrompt = ai.definePrompt({
  name: 'taskAndActivityReviewPrompt',
  input: { schema: TaskAndActivityReviewInputSchema },
  output: { schema: TaskAndActivityReviewOutputSchema },
  tools: [getTasksSummaryTool],
  prompt: `You are a professional business analyst. Use the tools to answer: "{{{query}}}"
User Role: {{{userRole}}}
Tenant: {{{tenantId}}}

If the user asks for logs and their role is not 'Business Owner' or 'Manager', say: "You do not have permission to access this information."
Always end with: "I can only answer based on the data available in your business account and your permission level."`,
});

export async function taskAndActivityReview(input: TaskAndActivityReviewInput): Promise<TaskAndActivityReviewOutput> {
  const { output } = await taskAndActivityReviewPrompt(input);
  return output!;
}
