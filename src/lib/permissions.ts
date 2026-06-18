
import { Role } from './types';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Platform Super Admin': ['managePlatform'],
  'Business Owner': ['*'], // Full access
  'Manager': ['viewInventory', 'manageInventory', 'viewSales', 'manageSales', 'viewExpenses', 'manageExpenses', 'viewTasks', 'manageTasks', 'viewReports', 'viewActivityLogs', 'viewCustomers', 'manageCustomers', 'viewSuppliers', 'manageSuppliers', 'viewDocuments', 'manageDocuments'],
  'Accountant': ['viewSales', 'manageSales', 'viewExpenses', 'manageExpenses', 'viewFinance', 'manageFinance', 'viewReports', 'viewDocuments'],
  'HR Officer': ['viewEmployees', 'manageEmployees', 'viewAttendance', 'viewSalaryRecords', 'viewReports', 'viewTasks', 'manageTasks', 'viewDocuments', 'manageDocuments'],
  'Staff': ['viewInventory', 'viewSales', 'viewTasks', 'manageTasks', 'viewDocuments'],
  'Viewer': ['viewInventory', 'viewSales', 'viewTasks', 'viewReports', 'viewDocuments'],
};

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
}
