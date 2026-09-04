import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/app_user.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/task_provider.dart';
import '../providers/transaction_provider.dart';
import '../services/auth_service.dart';
import 'dashboard_screen.dart';
import 'platform_admin_screen.dart';
import 'tasks_list_screen.dart';
import 'welcome_screen.dart';

class SessionGate extends StatefulWidget {
  const SessionGate({super.key});

  @override
  State<SessionGate> createState() => _SessionGateState();
}

class _SessionGateState extends State<SessionGate> {
  late Future<AppUser?> _session;

  @override
  void initState() {
    super.initState();
    _session = _restore();
  }

  Future<AppUser?> _restore() async {
    final user = await AuthService.restoreSession();
    if (user == null || !mounted) return user;
    if (user.role == UserRole.platformSuperAdmin) {
      context.read<CoreProvider>().reset();
      context.read<InventoryProvider>().reset();
      context.read<TransactionProvider>().reset();
      context.read<TaskProvider>().reset();
      return user;
    }
    if (user.role == UserRole.staff) {
      context.read<CoreProvider>().reset();
      context.read<InventoryProvider>().reset();
      context.read<TransactionProvider>().reset();
      try {
        await context.read<TaskProvider>().loadData();
      } catch (_) {
        // The task screen owns its retry state.
      }
      return user;
    }
    final loaders = <Future<void>>[
      context.read<CoreProvider>().loadData(),
      context.read<InventoryProvider>().loadData(),
      context.read<TransactionProvider>().loadData(),
      context.read<TaskProvider>().loadData(),
    ];
    await Future.wait(
      loaders.map((loader) async {
        try {
          await loader;
        } catch (_) {
          // Individual modules expose their own retry controls. A temporary
          // failure must not discard an otherwise valid authenticated session.
        }
      }),
    );
    return user;
  }

  void _retry() => setState(() => _session = _restore());

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<AppUser?>(
      future: _session,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Restoring your SmartERP workspace…'),
                ],
              ),
            ),
          );
        }
        if (snapshot.hasError) {
          return Scaffold(
            body: SafeArea(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.cloud_off_rounded, size: 52),
                      const SizedBox(height: 16),
                      const Text(
                        'Your session is still stored, but the server is unavailable.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 18),
                      FilledButton.icon(
                        onPressed: _retry,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Retry'),
                      ),
                      TextButton(
                        onPressed: () async {
                          await AuthService.logout();
                          if (mounted) {
                            setState(() => _session = Future.value(null));
                          }
                        },
                        child: const Text('Sign in with another account'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }
        final user = snapshot.data;
        if (user == null) return const WelcomeScreen();
        if (user.role == UserRole.platformSuperAdmin) {
          return const PlatformAdminScreen();
        }
        if (user.role == UserRole.staff) return const TasksListScreen();
        return const DashboardScreen();
      },
    );
  }
}
