const COMPANY_ROLES = [
  "Business Owner",
  "Manager",
  "Accountant",
  "HR Officer",
  "Staff",
  "Viewer",
] as const

export const ROUTE_ROLES: Record<string, readonly string[]> = {
  "/admin/dashboard": ["Platform Super Admin"],
  "/admin/users": ["Platform Super Admin"],
  "/dashboard": COMPANY_ROLES,
  "/inventory": ["Business Owner", "Manager", "Staff", "Viewer"],
  "/sales": ["Business Owner", "Manager", "Accountant", "Staff", "Viewer"],
  "/expenses": ["Business Owner", "Manager", "Accountant"],
  "/finance": ["Business Owner", "Manager", "Accountant"],
  "/tasks": ["Business Owner", "Manager", "HR Officer", "Staff", "Viewer"],
  "/announcements": COMPANY_ROLES,
  "/employees": ["Business Owner", "HR Officer"],
  "/hr": ["Business Owner", "HR Officer", "Manager"],
  "/payroll": ["Business Owner", "HR Officer", "Accountant"],
  "/accounting": ["Business Owner", "Manager", "Accountant"],
  "/customers": ["Business Owner", "Manager"],
  "/suppliers": ["Business Owner", "Manager"],
  "/reports/sales-inventory": ["Business Owner", "Manager", "Viewer"],
  "/reports/tasks": ["Business Owner", "Manager", "HR Officer", "Viewer"],
  "/reports": ["Business Owner", "Manager", "Accountant", "HR Officer", "Viewer"],
  "/documents": COMPANY_ROLES,
  "/activity-logs": ["Business Owner", "Manager"],
  "/settings": ["Business Owner"],
  "/business-profile": ["Business Owner"],
}

export function canAccessRoute(pathname: string, role?: string | null) {
  const entry = Object.entries(ROUTE_ROLES)
    .filter(([route]) => pathname === route || pathname.startsWith(`${route}/`))
    .sort(([left], [right]) => right.length - left.length)[0]
  return !entry || Boolean(role && entry[1].includes(role))
}
