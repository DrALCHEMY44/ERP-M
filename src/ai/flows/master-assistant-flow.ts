'use server';
/**
 * @fileOverview Master AI Assistant Flow for SmartERP AI.
 * Acts as the central brain, orchestrating specialized tools to answer business queries.
 * 
 * - masterAssistant - Central function for AI interaction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input/Output Schemas
const MasterAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s natural language question.'),
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

/**
 * TOOLS: These allow the LLM to "fetch" data safely.
 * In a production app, these would perform real Firestore queries filtered by tenantId.
 */

const getBusinessDataTool = ai.defineTool(
  {
    name: 'getBusinessData',
    description: 'Fetches high-level metrics for sales, inventory, and financials for the current business.',
    inputSchema: z.object({
      tenantId: z.string(),
      businessId: z.string(),
      userRole: z.string(),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    // Permission Check
    const sensitiveRoles = ['Business Owner', 'Manager', 'Accountant'];
    const canSeeFinancials = sensitiveRoles.includes(input.userRole);

    // Simulated data retrieval (In production, use Firestore)
    return {
      salesToday: canSeeFinancials ? '150,000 FCFA' : 'Access Restricted',
      salesThisMonth: canSeeFinancials ? '3,500,000 FCFA' : 'Access Restricted',
      profitThisWeek: canSeeFinancials ? '800,000 FCFA' : 'Access Restricted',
      lowStockItems: [
        { name: 'Riz Long Grain', stock: 5, alert: 20 },
        { name: 'Huile de Palme', stock: 2, alert: 10 }
      ],
      topCustomer: canSeeFinancials ? 'Samuel Eto\'o (450,000 FCFA spent)' : 'Access Restricted',
    };
  }
);

const getTaskStatusTool = ai.defineTool(
  {
    name: 'getTaskStatus',
    description: 'Fetches operational task statuses, overdue counts, and employee performance.',
    inputSchema: z.object({
      tenantId: z.string(),
      businessId: z.string(),
    }),
    outputSchema: z.any(),
  },
  async () => {
    return {
      ongoingTasks: 5,
      dueToday: 2,
      overdueTasks: 3,
      mostOverdueEmployee: 'John Doe (3 tasks)',
      departmentWithMostDelays: 'Logistics',
      recentCompleted: 'Marie Claire completed "Inventory Audit" yesterday.',
    };
  }
);

const getActivityLogsTool = ai.defineTool(
  {
    name: 'getActivityLogs',
    description: 'Fetches the audit trail and system activity logs.',
    inputSchema: z.object({
      tenantId: z.string(),
      businessId: z.string(),
      userRole: z.string(),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    if (!['Business Owner', 'Manager'].includes(input.userRole)) {
      return { error: 'Permission Denied' };
    }
    return {
      recentLogs: [
        { user: 'Jean-Pierre Kamga', action: 'Login', time: '10:00 AM' },
        { user: 'Marie Claire', action: 'Edited Product: Riz', time: '11:30 AM' },
        { user: 'Accountant', action: 'Uploaded Tax Receipt', time: '12:45 PM' }
      ]
    };
  }
);

const masterAssistantPrompt = ai.definePrompt({
  name: 'masterAssistantPrompt',
  input: { schema: MasterAssistantInputSchema },
  output: { schema: MasterAssistantOutputSchema },
  tools: [getBusinessDataTool, getTaskStatusTool, getActivityLogsTool],
  prompt: `You are the SmartERP AI Assistant, a professional read-only business consultant for Cameroonian SMEs.

GUARDRAILS:
1. READ-ONLY: You cannot add, edit, delete, or modify any records. 
2. MODIFICATION REQUESTS: If asked to change data, respond exactly: "I can summarize and report on business information, but I cannot modify records."
3. PERMISSIONS: Respect the user's role: '{{{userRole}}}'. If they ask for data they cannot access (like profit for a Staff member), respond exactly: "You do not have permission to access this information."
4. TENANT ISOLATION: Only use tools with tenantId: '{{{tenantId}}}' and businessId: '{{{businessId}}}'.
5. MANDATORY FOOTER: Every response must end with: "I can only answer based on the data available in your business account and your permission level."

Query: "{{{query}}}"

Instructions:
- Use tools to fetch data if the user asks for specific metrics (sales, tasks, logs, etc.).
- Be professional, concise, and helpful.
- Use FCFA for all currency values.
`,
});

export const masterAssistant = ai.defineFlow(
  {
    name: 'masterAssistant',
    inputSchema: MasterAssistantInputSchema,
    outputSchema: MasterAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await masterAssistantPrompt(input);
    return output!;
  }
);
