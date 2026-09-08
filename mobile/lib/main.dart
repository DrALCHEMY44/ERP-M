import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'providers/core_provider.dart';
import 'providers/inventory_provider.dart';
import 'providers/transaction_provider.dart';
import 'providers/task_provider.dart';
import 'screens/login_screen.dart';
import 'screens/welcome_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/inventory_screen.dart';
import 'screens/sales_screen.dart';
import 'screens/web_sale_scanner_screen.dart';
import 'screens/expenses_screen.dart';
import 'screens/tasks_list_screen.dart';
import 'screens/task_assignment_screen.dart';
import 'screens/reports_screen.dart';
import 'screens/ai_assistant_screen.dart';
import 'screens/activity_logs_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/business_module_screen.dart';
import 'screens/enterprise_module_screen.dart';
import 'screens/session_gate.dart';
import 'screens/platform_admin_screen.dart';
import 'screens/business_profile_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/documents_screen.dart';
import 'screens/finance_screen.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => CoreProvider()),
        ChangeNotifierProvider(create: (_) => InventoryProvider()),
        ChangeNotifierProvider(create: (_) => TransactionProvider()),
        ChangeNotifierProvider(create: (_) => TaskProvider()),
      ],
      child: const SmartERPApp(),
    ),
  );
}

class SmartERPApp extends StatelessWidget {
  const SmartERPApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Read theme mode from the ThemeProvider
    final themeMode = Provider.of<ThemeProvider>(context).themeMode;

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SmartERP Mobile',

      themeMode: themeMode,

      theme: AppTheme.light,
      darkTheme: AppTheme.dark,

      home: const SessionGate(),

      routes: {
        '/welcome': (context) => const WelcomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegistrationScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/inventory': (context) => const InventoryScreen(),
        '/sales': (context) => const SalesScreen(),
        '/web-sale-scanner': (context) => const WebSaleScannerScreen(),
        '/expenses': (context) => const ExpensesScreen(),
        '/tasks': (context) => const TasksListScreen(),
        '/assign-task': (context) => const TaskAssignmentScreen(),
        '/reports': (context) => const ReportsScreen(),
        '/ai-assistant': (context) => const AiAssistantScreen(),
        '/activity-logs': (context) => const ActivityLogsScreen(),
        '/notifications': (context) => const NotificationsScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/business-profile': (context) => const BusinessProfileScreen(),
        '/finance': (context) => const FinanceScreen(),
        '/employees': (context) =>
            const BusinessModuleScreen(module: BusinessModule.employees),
        '/hr': (context) =>
            const EnterpriseModuleScreen(module: EnterpriseModule.hr),
        '/payroll': (context) =>
            const EnterpriseModuleScreen(module: EnterpriseModule.payroll),
        '/accounting': (context) =>
            const EnterpriseModuleScreen(module: EnterpriseModule.accounting),
        '/customers': (context) =>
            const BusinessModuleScreen(module: BusinessModule.customers),
        '/suppliers': (context) =>
            const BusinessModuleScreen(module: BusinessModule.suppliers),
        '/documents': (context) => const DocumentsScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/admin/dashboard': (context) => const PlatformAdminScreen(),
        '/admin/users': (context) => const PlatformAdminScreen(initialTab: 2),
      },
    );
  }
}
