'use server';
/**
 * @fileOverview This file implements a Genkit flow for the AI Assistant to provide summaries
 * of employee task performance and recent system activities. It respects tenant-based
 * and role-based access control, allowing Managers and HR Officers to monitor productivity
 * and track operational changes. The AI is read-only and cannot modify any records.
 *
 * - taskAndActivityReview - The main function to call the AI assistant.
 * - TaskAndActivityReviewInput - The input type for the taskAndActivityReview function.
 * - TaskAndActivityReviewOutput - The return type for the taskAndActivityReview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock data for demonstration purposes, replace with actual Firestore queries
interface Task {
  taskId: string;
  tenantId: string;
  businessId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Late' | 'Overdue';
  startDate: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityLog {
  logId: string;
  tenantId: string;
  businessId: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: string;
  module: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  recordId?: string;
  timestamp: string;
  deviceInfo?: string;
}

const mockTasks: Task[] = [
  {
    taskId: 'task1',
    tenantId: 'tenant1',
    businessId: 'business1',
    title: 'Prepare monthly sales report',
    description: 'Compile sales data for Q1',
    assignedTo: 'John Doe',
    assignedBy: 'Jane Smith',
    department: 'Sales',
    priority: 'High',
    status: 'Overdue',
    startDate: '2023-03-01',
    dueDate: '2023-03-15',
    createdAt: '2023-02-28T10:00:00Z',
    updatedAt: '2023-03-16T14:30:00Z',
  },
  {
    taskId: 'task2',
    tenantId: 'tenant1',
    businessId: 'business1',
    title: 'Update inventory records',
    description: 'Log new stock arrivals',
    assignedTo: 'Jane Smith',
    assignedBy: 'Manager',
    department: 'Operations',
    priority: 'Medium',
    status: 'Completed',
    startDate: '2023-03-20',
    dueDate: '2023-03-22',
    completedAt: '2023-03-21T11:00:00Z',
    createdAt: '2023-03-19T09:00:00Z',
    updatedAt: '2023-03-21T11:00:00Z',
  },
  {
    taskId: 'task3',
    tenantId: 'tenant1',
    businessId: 'business1',
    title: 'Review HR policies',
    description: 'Check compliance with new labor laws',
    assignedTo: 'Emily White',
    assignedBy: 'CEO',
    department: 'HR',
    priority: 'Urgent',
    status: 'Pending',
    startDate: '2023-03-25',
    dueDate: '2023-03-30',
    createdAt: '2023-03-24T10:00:00Z',
    updatedAt: '2023-03-24T10:00:00Z',
  },
  {
    taskId: 'task4',
    tenantId: 'tenant2',
    businessId: 'business2',
    title: 'Prepare Q2 budget',
    description: 'Draft budget proposal for Q2',
    assignedTo: 'Finance Guy',
    assignedBy: 'Owner',
    department: 'Finance',
    priority: 'High',
    status: 'Ongoing',
    startDate: '2023-04-01',
    dueDate: '2023-04-15',
    createdAt: '2023-03-30T10:00:00Z',
    updatedAt: '2023-04-05T11:00:00Z',
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    logId: 'log1',
    tenantId: 'tenant1',
    businessId: 'business1',
    userId: 'user1',
    userName: 'John Doe',
    userRole: 'Staff',
    actionType: 'Product Edited',
    module: 'Inventory',
    description: 'Updated price for Product A',
    oldValue: '100 FCFA',
    newValue: '110 FCFA',
    recordId: 'prod123',
    timestamp: '2023-04-05T10:30:00Z',
  },
  {
    logId: 'log2',
    tenantId: 'tenant1',
    businessId: 'business1',
    userId: 'user2',
    userName: 'Jane Smith',
    userRole: 'Manager',
    actionType: 'Sale Recorded',
    module: 'Sales',
    description: 'Recorded new sale transaction',
    recordId: 'sale456',
    timestamp: '2023-04-05T11:00:00Z',
  },
  {
    logId: 'log3',
    tenantId: 'tenant1',
    businessId: 'business1',
    userId: 'user3',
    userName: 'Emily White',
    userRole: 'HR Officer',
    actionType: 'Employee Added',
    module: 'Employees',
    description: 'Added new employee record for Alex',
    recordId: 'emp789',
    timestamp: '2023-04-04T15:00:00Z',
  },
  {
    logId: 'log4',
    tenantId: 'tenant2',
    businessId: 'business2',
    userId: 'user5',
    userName: 'Finance Guy',
    userRole: 'Accountant',
    actionType: 'Expense Recorded',
    module: 'Expenses',
    description: 'Recorded office supply expense',
    recordId: 'exp101',
    timestamp: '2023-04-03T09:00:00Z',
  },
  {
    logId: 'log5',
    tenantId: 'tenant1',
    businessId: 'business1',
    userId: 'user1',
    userName: 'John Doe',
    userRole: 'Staff',
    actionType: 'Task Status Updated',
    module: 'Tasks',
    description: 'Changed status of Task 1 to Completed',
    oldValue: 'Ongoing',
    newValue: 'Completed',
    recordId: 'task1',
    timestamp: '2023-04-06T09:15:00Z',
  },
];

// Helper function to simulate Firestore data retrieval with tenant/business isolation
function getTasksForBusiness(tenantId: string, businessId: string): Task[] {
  return mockTasks.filter(
    (task) => task.tenantId === tenantId && task.businessId === businessId
  );
}

function getActivityLogsForBusiness(tenantId: string, businessId: string): ActivityLog[] {
  return mockActivityLogs.filter(
    (log) => log.tenantId === tenantId && log.businessId === businessId
  );
}

const TaskAndActivityReviewInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query for task performance or activity logs.'),
  tenantId: z.string().describe('The ID of the current tenant.'),
  businessId: z.string().describe('The ID of the current business.'),
  userId: z.string().describe('The ID of the current user.'),
  userRole: z.enum(['Platform Super Admin', 'Business Owner', 'Manager', 'Accountant', 'HR Officer', 'Staff', 'Viewer']).describe('The role of the current user.'),
});
export type TaskAndActivityReviewInput = z.infer<typeof TaskAndActivityReviewInputSchema>;

const TaskAndActivityReviewOutputSchema = z.object({
  response: z.string().describe('The AI\'s summary of task performance or activity logs.'),
});
export type TaskAndActivityReviewOutput = z.infer<typeof TaskAndActivityReviewOutputSchema>;

const getTasksSummaryTool = ai.defineTool(
  {
    name: 'getTasksSummary',
    description: 'Provides a summary of tasks based on employee, status, or date ranges for the current business.',
    inputSchema: z.object({
      employeeName: z.string().optional().describe('The name of the employee to filter tasks for.'),
      status: z.array(z.enum(['Pending', 'Ongoing', 'Completed', 'Cancelled', 'Late', 'Overdue'])).optional().describe('Filter tasks by status (e.g., ["Overdue"]).'),
      timePeriod: z.string().optional().describe('A descriptive string for the time period (e.g., "this week", "last month", "today").'),
      tenantId: z.string().describe('The ID of the current tenant.'),
      businessId: z.string().describe('The ID of the current business.'),
      userRole: z.enum(['Platform Super Admin', 'Business Owner', 'Manager', 'Accountant', 'HR Officer', 'Staff', 'Viewer']).describe('The role of the current user.'),
    }),
    outputSchema: z.object({
      summary: z.string().describe('A summary of the requested tasks.'),
      data: z.array(z.any()).optional().describe('Raw task data.'),
    }),
  },
  async ({ employeeName, status, timePeriod, tenantId, businessId, userRole }) => {
    // Permission check for accessing task data
    const allowedRolesForTasks = ['Business Owner', 'Manager', 'HR Officer', 'Staff'];
    if (!allowedRolesForTasks.includes(userRole)) {
      return { summary: 'You do not have permission to access task information.' };
    }

    let tasks = getTasksForBusiness(tenantId, businessId);

    if (employeeName) {
      tasks = tasks.filter(task => task.assignedTo.toLowerCase().includes(employeeName.toLowerCase()));
    }

    if (status && status.length > 0) {
      tasks = tasks.filter(task => status.includes(task.status));
    }

    // Simulate time period filtering (basic)
    if (timePeriod) {
      const now = new Date();
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      tasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        if (timePeriod.toLowerCase().includes('today')) {
          return taskDate.toDateString() === new Date().toDateString();
        } else if (timePeriod.toLowerCase().includes('this week')) {
          return taskDate >= sevenDaysAgo;
        } else if (timePeriod.toLowerCase().includes('last month')) {
          return taskDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    if (tasks.length === 0) {
      return { summary: 'No tasks found matching your criteria.' };
    }

    // Generate a simple summary based on filtered tasks
    const overdueCount = tasks.filter(t => t.status === 'Overdue').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingCount = tasks.filter(t => t.status === 'Pending').length;
    const ongoingCount = tasks.filter(t => t.status === 'Ongoing').length;

    let summary = `For ${employeeName || 'all employees'}${timePeriod ? ` ${timePeriod}` : ''}:
    Total tasks: ${tasks.length}
    Overdue tasks: ${overdueCount}
    Completed tasks: ${completedCount}
    Pending tasks: ${pendingCount}
    Ongoing tasks: ${ongoingCount}
    `;

    if (overdueCount > 0) {
      summary += `
    Overdue tasks include: ${tasks.filter(t => t.status === 'Overdue').map(t => `'${t.title}' due by ${t.dueDate}`).join(', ')}.`;
    }

    return { summary, data: tasks };
  }
);

const getActivityLogSummaryTool = ai.defineTool(
  {
    name: 'getActivityLogSummary',
    description: 'Provides a summary of recent system activities based on module or time period for the current business.',
    inputSchema: z.object({
      module: z.string().optional().describe('The module to filter activity logs for (e.g., "Inventory", "Sales").'),
      timePeriod: z.string().optional().describe('A descriptive string for the time period (e.g., "today", "this week", "last 24 hours").'),
      tenantId: z.string().describe('The ID of the current tenant.'),
      businessId: z.string().describe('The ID of the current business.'),
      userRole: z.enum(['Platform Super Admin', 'Business Owner', 'Manager', 'Accountant', 'HR Officer', 'Staff', 'Viewer']).describe('The role of the current user.'),
    }),
    outputSchema: z.object({
      summary: z.string().describe('A summary of the requested activity logs.'),
      data: z.array(z.any()).optional().describe('Raw activity log data.'),
    }),
  },
  async ({ module, timePeriod, tenantId, businessId, userRole }) => {
    // Permission check for accessing activity logs
    const allowedRolesForActivityLogs = ['Business Owner', 'Manager', 'HR Officer'];
    if (!allowedRolesForActivityLogs.includes(userRole)) {
      return { summary: 'You do not have permission to access activity log information.' };
    }

    let logs = getActivityLogsForBusiness(tenantId, businessId);

    if (module) {
      logs = logs.filter(log => log.module.toLowerCase() === module.toLowerCase());
    }

    // Simulate time period filtering (basic)
    if (timePeriod) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

      logs = logs.filter(log => {
        const logTimestamp = new Date(log.timestamp);
        if (timePeriod.toLowerCase().includes('today') || timePeriod.toLowerCase().includes('24 hours')) {
          return logTimestamp >= twentyFourHoursAgo && logTimestamp <= now;
        } else if (timePeriod.toLowerCase().includes('this week')) {
          return logTimestamp >= sevenDaysAgo && logTimestamp <= now;
        }
        return true;
      });
    }

    if (logs.length === 0) {
      return { summary: 'No activity logs found matching your criteria.' };
    }

    // Generate a simple summary of recent activities
    const summary = `Recent activities${module ? ` in the ${module} module` : ''}${timePeriod ? ` ${timePeriod}` : ''}:
    ${logs.map(log => `- ${new Date(log.timestamp).toLocaleString()}: ${log.userName} (${log.userRole}) ${log.description}`).join('\n')}`; 

    return { summary, data: logs };
  }
);

const taskAndActivityReviewPrompt = ai.definePrompt({
  name: 'taskAndActivityReviewPrompt',
  input: { schema: TaskAndActivityReviewInputSchema },
  output: { schema: TaskAndActivityReviewOutputSchema },
  tools: [getTasksSummaryTool, getActivityLogSummaryTool],
  prompt: `You are an AI Assistant for SmartERP AI, a business management platform. Your role is to provide summaries, insights, and explanations based on the user's business data.

IMPORTANT GUIDELINES:
1. You are read-only: You CANNOT modify any data, add records, delete records, approve transactions, assign tasks, or change settings.
2. Respect Permissions: You MUST strictly adhere to the user's role and permission level. If the user asks for information they are not authorized to view, respond with: 