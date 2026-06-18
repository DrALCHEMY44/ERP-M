'use server';
/**
 * @fileOverview Master AI Assistant Flow for SmartERP AI with strict RBAC.
 * Acts as the central brain, orchestrating specialized tools with role-based filtering.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
 * RBAC TOOLS
 */

const getFinanceDataTool = ai.defineTool(
  {
    name: 'getFinanceData',
    description: 'Fetches financial metrics (Sales, Expenses, Profit). Restricted to Owner and Accountant.',
    inputSchema: z.object({
      userRole: z.string(),
      includeProfit: z.boolean().default(false),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    const authorizedRoles = ['Business Owner', 'Accountant'];
    if (!authorizedRoles.includes(input.userRole)) {
      return { error: 'You do not have permission to access financial information.' };
    }

    return {
      salesToday: '150,000 FCFA',
      expensesToday: '45,000 FCFA',
      profitThisWeek: input.userRole === 'Business Owner' || input.includeProfit ? '800,000 FCFA' : 'Access Restricted',
      currency: 'FCFA'
    };
  }
);

const getInventoryAndOpsTool = ai.defineTool(
  {
    name: 'getInventoryAndOps',
    description: 'Fetches stock levels and customer/supplier summaries. Restricted to Owner, Manager, and Staff.',
    inputSchema: z.object({
      userRole: z.string(),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    const authorizedRoles = ['Business Owner', 'Manager', 'Staff', 'Viewer'];
    if (!authorizedRoles.includes(input.userRole)) {
      return { error: 'You do not have permission to access operational information.' };
    }

    return {
      lowStockItems: [
        { name: 'Riz Long Grain', stock: 5, alert: 20 },
        { name: 'Savon Azur', stock: 12, alert: 50 }
      ],
      activeSuppliers: 8,
      topCustomer: input.userRole === 'Staff' ? 'Restricted' : 'Samuel Eto\'o',
    };
  }
);

const getHRAndStaffTool = ai.defineTool(
  {
    name: 'getHRAndStaff',
    description: 'Fetches employee directory, attendance, and salary info. Restricted to Owner and HR Officer.',
    inputSchema: z.object({
      userRole: z.string(),
      includeSalaries: z.boolean().default(false),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    const authorizedRoles = ['Business Owner', 'HR Officer'];
    if (!authorizedRoles.includes(input.userRole)) {
      return { error: 'You do not have permission to access HR information.' };
    }

    return {
      totalStaff: 12,
      activeToday: 11,
      attendanceRate: '92%',
      salaryExpenditure: input.includeSalaries ? '2,400,000 FCFA' : 'Access Restricted',
    };
  }
);

const getAuditLogsTool = ai.defineTool(
  {
    name: 'getAuditLogs',
    description: 'Fetches activity logs. Restricted to Owner and Manager.',
    inputSchema: z.object({
      userRole: z.string(),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    if (!['Business Owner', 'Manager'].includes(input.userRole)) {
      return { error: 'You do not have permission to access system activity logs.' };
    }
    return {
      recentLogs: [
        { user: 'Marie Claire', action: 'Update Stock', time: '2 mins ago' },
        { user: 'Accountant', action: 'Record Expense', time: '1 hour ago' }
      ]
    };
  }
);

const masterAssistantPrompt = ai.definePrompt({
  name: 'masterAssistantPrompt',
  input: { schema: MasterAssistantInputSchema },
  output: { schema: MasterAssistantOutputSchema },
  tools: [getFinanceDataTool, getInventoryAndOpsTool, getHRAndStaffTool, getAuditLogsTool],
  prompt: `You are the SmartERP AI Assistant for Cameroonian SMEs. You must apply strict Role-Based Access Control.

USER PROFILE:
- Tenant: {{{tenantId}}}
- Business: {{{businessId}}}
- Role: {{{userRole}}}

ROLE-SPECIFIC GUIDELINES:
1. BUSINESS OWNER: Can access everything (Finance, HR, Ops, Audit).
2. MANAGER: Access to Ops, Inventory, Customers, Suppliers, and Logs. NO Profit/Loss or Salary details.
3. ACCOUNTANT: Access to Finance, Sales, Expenses, and Profits. NO HR/Staff personal data.
4. HR OFFICER: Access to Staff records, Attendance, and Salaries. NO Sales/Profit data.
5. STAFF: Only assigned tasks, low stock, and basic ops.
6. PLATFORM SUPER ADMIN: No access to private tenant data unless specified.

GUARDRAILS:
1. READ-ONLY: If asked to modify, say: "I can summarize and report on business information, but I cannot modify records."
2. PERMISSIONS: If tools return an error or if you identify a sensitive request unauthorized for role '{{{userRole}}}', say: "You do not have permission to access this information."
3. MANDATORY FOOTER: Always end with: "I can only answer based on the data available in your business account and your permission level."

Query: "{{{query}}}"
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
