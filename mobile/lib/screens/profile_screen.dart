import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../models/app_user.dart';
import '../widgets/app_drawer.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final user = AuthService.currentUser;

    // Fetch permissions list for the current role
    final permissions = AuthService.rolePermissions[user?.role] ?? [];

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile & Settings')),
      drawer: const AppDrawer(currentRoute: '/profile'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // User Profile Header Card
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: theme.colorScheme.primaryContainer,
                      child: Icon(Icons.person, size: 50, color: theme.colorScheme.primary),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      user?.name ?? 'Guest User',
                      style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      user?.email ?? 'email@example.com',
                      style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey.shade600),
                    ),
                    const SizedBox(height: 8),
                    Chip(
                      label: Text(user?.role.displayName.toUpperCase() ?? 'STAFF'),
                      backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.1),
                      labelStyle: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Profile info items
            Text('Workspace Isolation Details', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Column(
                  children: [
                    _infoTile(Icons.domain, 'Business Code Space', user?.businessCode ?? user?.tenantId ?? 'N/A'),
                    const Divider(height: 1),
                    _infoTile(Icons.business_center, 'Business Identifier', user?.businessId ?? 'N/A'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Theme Settings
            Text('Preferences', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: SwitchListTile(
                title: const Text('Dark Mode Theme'),
                subtitle: const Text('Toggle between Light and Dark aesthetics'),
                secondary: Icon(themeProvider.themeMode == ThemeMode.dark ? Icons.dark_mode : Icons.light_mode, color: theme.colorScheme.primary),
                value: themeProvider.themeMode == ThemeMode.dark,
                onChanged: (val) {
                  themeProvider.toggleThemeMode();
                },
              ),
            ),
            const SizedBox(height: 20),

            // Demo Quick-Switch Dropdown for Evaluation
            Card(
              color: theme.colorScheme.tertiaryContainer.withValues(alpha: 0.15),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: theme.colorScheme.tertiary.withValues(alpha: 0.3)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.swap_horizontal_circle_outlined, color: theme.colorScheme.tertiary),
                        const SizedBox(width: 8),
                        Text(
                          'Defense Demo Role Switcher',
                          style: theme.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.onTertiaryContainer,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Instantly hot-swap active role/tenant to demonstrate security rule boundaries without logging out.',
                      style: TextStyle(fontSize: 11, color: Colors.black54),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<AppUser>(
                      decoration: const InputDecoration(
                        labelText: 'Hot-Swap Active User Profile',
                        border: OutlineInputBorder(),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      value: AuthService.demoUsers.firstWhere((u) => u.id == user?.id, orElse: () => AuthService.demoUsers.first),
                      items: AuthService.demoUsers.map((u) => DropdownMenuItem(
                        value: u,
                        child: Text('${u.name} (${u.role.displayName})', style: const TextStyle(fontSize: 12)),
                      )).toList(),
                      onChanged: (newVal) {
                        if (newVal != null) {
                          setState(() {
                            AuthService.loginWithUser(newVal);
                          });
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Switched workspace to ${newVal.name} - Tenant: ${newVal.tenantId}'),
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: theme.colorScheme.secondary,
                            ),
                          );
                          // Force rebuild of parent drawer / dashboard
                          Navigator.pushReplacementNamed(context, '/dashboard');
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Role Permissions Display
            Text('Active Permissions (${permissions.length})', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: permissions.contains('*')
                    ? const Row(
                        children: [
                          Icon(Icons.workspace_premium, color: Colors.amber),
                          SizedBox(width: 8),
                          Text('Superuser Access (*): All Permissions Granted', style: TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: permissions.map((p) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_outline, color: Colors.green, size: 16),
                              const SizedBox(width: 8),
                              Text(p, style: const TextStyle(fontFamily: 'Courier', fontSize: 13)),
                            ],
                          ),
                        )).toList(),
                      ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _infoTile(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade600),
      title: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      subtitle: Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
    );
  }
}
