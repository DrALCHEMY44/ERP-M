import { Role } from './types';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Platform Super Admin': ['managePlatform'],
  'Business Owner': ['*'], // Full access
  'Manager': ['viewInventory', 'manageInventory', 'viewSales', 'manageSales', 'viewExpenses', 'manageExpenses', 'viewTasks', 'manageTasks', 'viewReports', 'viewActivityLogs', 'viewCustomers', 'manageCustomers', 'viewSuppliers', 'manageSuppliers'],
  'Accountant': ['viewSales', 'manageSales', 'viewExpenses', 'manageExpenses', 'viewFinance', 'manageFinance', 'viewReports'],
  'HR Officer': ['viewEmployees', 'manageEmployees', 'viewAttendance', 'viewSalaryRecords', 'viewReports', 'viewTasks', 'manageTasks'],
  'Staff': ['viewInventory', 'viewSales', 'viewTasks', 'manageTasks'],
  'Viewer': ['viewInventory', 'viewSales', 'viewTasks', 'viewReports'],
};

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
}
