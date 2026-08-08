import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/app_user.dart';

class AppDrawer extends StatelessWidget {
  final String currentRoute;

  const AppDrawer({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context) {
    final user = AuthService.currentUser;
    final theme = Theme.of(context);

    // Dynamic destination items based on role-based security rules
    final List<_DrawerItemData> items = [];

    final isEmployee = user?.role == UserRole.staff;
    if (!isEmployee) {
      items.add(_DrawerItemData(
        icon: Icons.dashboard_outlined,
        selectedIcon: Icons.dashboard,
        label: 'Dashboard',
        route: '/dashboard',
      ));
    }

    if (AuthService.hasPermission('viewInventory')) {
      items.add(_DrawerItemData(
        icon: Icons.inventory_2_outlined,
        selectedIcon: Icons.inventory_2,
        label: 'Inventory',
        route: '/inventory',
      ));
    }

    if (AuthService.hasPermission('viewSales')) {
      items.add(_DrawerItemData(
        icon: Icons.point_of_sale_outlined,
        selectedIcon: Icons.point_of_sale,
        label: 'Sales Log',
        route: '/sales',
      ));
    }

    if (AuthService.hasPermission('viewExpenses')) {
      items.add(_DrawerItemData(
        icon: Icons.payments_outlined,
        selectedIcon: Icons.payments,
        label: 'Expenses',
        route: '/expenses',
      ));
      items.add(_DrawerItemData(
        icon: Icons.account_balance_wallet_outlined,
        selectedIcon: Icons.account_balance_wallet,
        label: 'Finance',
        route: '/finance',
      ));
    }

    if (AuthService.hasPermission('viewTasks')) {
      items.add(_DrawerItemData(
        icon: Icons.task_alt,
        selectedIcon: Icons.task,
        label: 'Tasks',
        route: '/tasks',
      ));
    }

    if (AuthService.hasPermission('viewReports')) {
      items.add(_DrawerItemData(
        icon: Icons.analytics_outlined,
        selectedIcon: Icons.analytics,
        label: 'Business Reports',
        route: '/reports',
      ));
    }

    if (!isEmployee) {
      items.addAll([
        _DrawerItemData(icon: Icons.badge_outlined, selectedIcon: Icons.badge, label: 'Employees', route: '/employees'),
        _DrawerItemData(icon: Icons.people_outline, selectedIcon: Icons.people, label: 'Customers', route: '/customers'),
        _DrawerItemData(icon: Icons.local_shipping_outlined, selectedIcon: Icons.local_shipping, label: 'Suppliers', route: '/suppliers'),
        _DrawerItemData(icon: Icons.folder_outlined, selectedIcon: Icons.folder, label: 'Documents', route: '/documents'),
      ]);
    }

    // AI Assistant always visible
    if (!isEmployee) {
      items.add(_DrawerItemData(
        icon: Icons.psychology_outlined,
        selectedIcon: Icons.psychology,
        label: 'SmartERP AI',
        route: '/ai-assistant',
      ));
    }

    // Divider
    final int dividerIndex = items.length;

    // Activity Logs (Manager/Owner only)
    if (AuthService.hasPermission('viewActivityLogs')) {
      items.add(_DrawerItemData(
        icon: Icons.history_outlined,
        selectedIcon: Icons.history,
        label: 'Activity Logs',
        route: '/activity-logs',
      ));
    }

    // Notifications & Profile always visible
    items.add(_DrawerItemData(
      icon: Icons.notifications_none,
      selectedIcon: Icons.notifications,
      label: 'Notifications',
      route: '/notifications',
    ));

    items.add(_DrawerItemData(
      icon: Icons.person_outline,
      selectedIcon: Icons.person,
      label: 'My Profile',
      route: '/profile',
    ));
    if (!isEmployee) {
      items.add(_DrawerItemData(
        icon: Icons.settings_outlined,
        selectedIcon: Icons.settings,
        label: 'Settings',
        route: '/settings',
      ));
    }

    int selectedIdx = items.indexWhere((item) => item.route == currentRoute);
    if (selectedIdx == -1) selectedIdx = 0; // Default to Dashboard

    return NavigationDrawer(
      selectedIndex: selectedIdx,
      onDestinationSelected: (index) {
        final item = items[index];
        if (item.route != currentRoute) {
          final navigator = Navigator.of(context);
          navigator.pop(); // Close the drawer before changing pages.
          if (currentRoute == '/dashboard' || (isEmployee && currentRoute == '/tasks')) {
            // Keep the dashboard below the selected module so Android Back
            // returns to the workspace instead of closing the application.
            navigator.pushNamed(item.route);
          } else if (item.route == '/dashboard') {
            navigator.popUntil((route) => route.isFirst);
          } else {
            // Replace one module with another while preserving the dashboard
            // at the bottom of the route stack.
            navigator.pushReplacementNamed(item.route);
          }
        }
      },
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(28, 12, 28, 8),
          child: Text('SMARTERP WORKSPACE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.4)),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(28, 32, 16, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: theme.colorScheme.primaryContainer,
                    child: Icon(Icons.person, size: 30, color: theme.colorScheme.primary),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? 'Guest User',
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          user?.role.displayName ?? 'Employee',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w600,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.secondaryContainer.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.secondaryContainer),
                ),
                child: Row(
                  children: [
                    Icon(Icons.domain, size: 16, color: theme.colorScheme.onSecondaryContainer),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Business Code: ${user?.businessCode ?? user?.tenantId ?? "N/A"}',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: theme.colorScheme.onSecondaryContainer,
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        // Render drawer items
        for (int i = 0; i < items.length; i++) ...[
          if (i == dividerIndex)
            const Padding(
              padding: EdgeInsets.fromLTRB(28, 8, 28, 8),
              child: Divider(),
            ),
          NavigationDrawerDestination(
            icon: Icon(items[i].icon),
            selectedIcon: Icon(items[i].selectedIcon),
            label: Text(items[i].label),
          ),
        ],

        Padding(
          padding: const EdgeInsets.fromLTRB(28, 24, 28, 20),
          child: OutlinedButton.icon(
            onPressed: () {
              AuthService.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
            icon: const Icon(Icons.logout),
            label: const Text('Sign Out'),
            style: OutlinedButton.styleFrom(
              foregroundColor: theme.colorScheme.error,
              side: BorderSide(color: theme.colorScheme.error.withValues(alpha: 0.5)),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
      ],
    );
  }
}

class _DrawerItemData {
  final IconData icon;
  final IconData selectedIcon;
  final String label;
  final String route;

  _DrawerItemData({
    required this.icon,
    required this.selectedIcon,
    required this.label,
    required this.route,
  });
}
