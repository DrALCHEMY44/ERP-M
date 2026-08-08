import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class ActivityLogsScreen extends StatelessWidget {
  const ActivityLogsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);

    // Enforce role-based security rules
    final bool isAuthorized = AuthService.hasPermission('viewActivityLogs');

    if (!isAuthorized) {
      return Scaffold(
        appBar: AppBar(title: const Text('Activity Audit Logs')),
        drawer: const AppDrawer(currentRoute: '/activity-logs'),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.gpp_bad, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  'Access Denied',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'You do not have the required role permissions to view the tenant\'s security audit logs.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final logs = core.activityLogs;

    return Scaffold(
      appBar: AppBar(title: const Text('Activity Audit Logs')),
      drawer: const AppDrawer(currentRoute: '/activity-logs'),
      body: logs.isEmpty
          ? const Center(child: Text('No audit logs registered.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: logs.length,
              itemBuilder: (context, index) {
                final log = logs[index];
                
                IconData logIcon = Icons.info_outline;
                Color iconColor = Colors.grey;

                switch (log.actionType) {
                  case 'LOGIN':
                    logIcon = Icons.login;
                    iconColor = Colors.blue;
                    break;
                  case 'RECORD_SALE':
                    logIcon = Icons.add_shopping_cart;
                    iconColor = Colors.green;
                    break;
                  case 'RECORD_EXPENSE':
                    logIcon = Icons.payments;
                    iconColor = Colors.red;
                    break;
                  case 'ASSIGN_TASK':
                    logIcon = Icons.task;
                    iconColor = Colors.orange;
                    break;
                  case 'UPDATE_TASK':
                    logIcon = Icons.edit_calendar;
                    iconColor = Colors.teal;
                    break;
                  case 'AI_ASSISTANT':
                    logIcon = Icons.psychology;
                    iconColor = Colors.purple;
                    break;
                  case 'GENERATE_REPORT':
                    logIcon = Icons.picture_as_pdf;
                    iconColor = Colors.red.shade700;
                    break;
                }

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          backgroundColor: iconColor.withValues(alpha: 0.15),
                          radius: 20,
                          child: Icon(logIcon, color: iconColor, size: 20),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                log.description,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Text(
                                    'By: ${log.userName} (${log.userRole})',
                                    style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    width: 4,
                                    height: 4,
                                    decoration: const BoxDecoration(color: Colors.grey, shape: BoxShape.circle),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _formatTime(log.timestamp),
                                    style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}';
  }
}
