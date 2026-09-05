import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../widgets/metric_grid.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  DateTime? _lastBackPressed;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeIn);
    _animController.forward();
    WidgetsBinding.instance.addPostFrameCallback((_) => _refreshData());
  }

  Future<void> _refreshData() async {
    if (!mounted) return;
    await Future.wait([
      context.read<CoreProvider>().loadData(),
      context.read<InventoryProvider>().loadData(),
      context.read<TransactionProvider>().loadData(),
      context.read<TaskProvider>().loadData(),
    ]);
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);

    final user = AuthService.currentUser;
    final businessCode = user?.businessCode?.trim();
    final workspaceDetails = [
      user?.role.displayName ?? 'Member',
      if (businessCode != null && businessCode.isNotEmpty) businessCode,
    ].join(' • ');
    final canViewInventory = AuthService.hasPermission('viewInventory');
    final canViewSales = AuthService.hasPermission('viewSales');
    final canViewExpenses = AuthService.hasPermission('viewExpenses');
    final canViewTasks = AuthService.hasPermission('viewTasks');

    // Financial calculations
    final double totalSales = transaction.sales.fold(
      0.0,
      (sum, item) => sum + item.totalAmount,
    );
    final double totalExpenses = transaction.expenses.fold(
      0.0,
      (sum, item) => sum + item.amount,
    );
    final double netProfit = totalSales - totalExpenses;

    // Low stock warnings
    final lowStockItems = inventory.inventory
        .where((item) => item.stockLevel <= item.lowStockLevel)
        .toList();

    // Overdue tasks
    final overdueTasks = taskProvider.tasks.where((t) => t.isOverdue).toList();

    // Quick Actions grid based on permissions
    final List<_QuickActionData> quickActions = [];
    if (AuthService.hasPermission('manageSales')) {
      quickActions.add(
        _QuickActionData('Record sale', Icons.add_shopping_cart, '/sales'),
      );
    }
    if (AuthService.hasPermission('manageExpenses')) {
      quickActions.add(
        _QuickActionData(
          'Record expense',
          Icons.remove_circle_outline,
          '/expenses',
        ),
      );
    }
    if (AuthService.hasPermission('manageTasks')) {
      quickActions.add(
        _QuickActionData('New task', Icons.add_task, '/assign-task'),
      );
    }
    if (AuthService.hasPermission('useAi')) {
      quickActions.add(
        _QuickActionData('AI assistant', Icons.psychology, '/ai-assistant'),
      );
    }
    if (AuthService.hasPermission('viewCustomers')) {
      quickActions.add(
        _QuickActionData('Customers', Icons.people, '/customers'),
      );
    }
    if (AuthService.hasPermission('viewEmployees')) {
      quickActions.add(
        _QuickActionData('Employees', Icons.badge, '/employees'),
      );
    }

    final navigationItems = <_NavigationItem>[
      const _NavigationItem('Home', Icons.dashboard_outlined, '/dashboard'),
      if (canViewSales)
        const _NavigationItem('Sales', Icons.point_of_sale_outlined, '/sales'),
      if (canViewInventory)
        const _NavigationItem(
          'Stock',
          Icons.inventory_2_outlined,
          '/inventory',
        ),
      if (canViewTasks)
        const _NavigationItem('Tasks', Icons.task_alt_outlined, '/tasks'),
      if (AuthService.hasPermission('useAi'))
        const _NavigationItem(
          'AI',
          Icons.auto_awesome_outlined,
          '/ai-assistant',
        ),
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        final now = DateTime.now();
        final shouldExit =
            _lastBackPressed != null &&
            now.difference(_lastBackPressed!) < const Duration(seconds: 2);
        if (shouldExit) {
          SystemNavigator.pop();
          return;
        }
        _lastBackPressed = now;
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(
            const SnackBar(
              content: Text('Press back again to exit SmartERP'),
              duration: Duration(seconds: 2),
              behavior: SnackBarBehavior.floating,
            ),
          );
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'SmartERP',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
              ),
              Text(
                'Your business workspace',
                style: TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
              ),
            ],
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          actions: [
            IconButton(
              icon: Stack(
                children: [
                  const Icon(Icons.notifications_none),
                  if (core.unreadNotifications.isNotEmpty)
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: Colors.redAccent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 14,
                          minHeight: 14,
                        ),
                        child: Text(
                          '${core.unreadNotifications.length}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              onPressed: () => Navigator.pushNamed(context, '/notifications'),
            ),
          ],
        ),
        drawer: const AppDrawer(currentRoute: '/dashboard'),
        body: RefreshIndicator(
          onRefresh: _refreshData,
          child: FadeTransition(
            opacity: _fadeAnim,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back, ${user?.name.split(" ")[0] ?? "there"}',
                              style: theme.textTheme.headlineSmall,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              workspaceDetails,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 24),
                            Row(
                              children: [
                                if (canViewInventory)
                                  _heroMetric(
                                    '${inventory.inventory.length}',
                                    'Products',
                                  ),
                                if (canViewTasks)
                                  _heroMetric(
                                    '${taskProvider.tasks.length}',
                                    'Tasks',
                                  ),
                                _heroMetric(
                                  '${core.unreadNotifications.length}',
                                  'Alerts',
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            const Divider(),
                          ],
                        ),
                      ),

                      if (canViewSales || canViewExpenses)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: MetricGrid(
                            metrics: [
                              if (canViewSales)
                                WorkspaceMetric(
                                  label: 'Revenue',
                                  value: _formatMoney(totalSales),
                                  detail: 'All recorded sales',
                                ),
                              if (canViewExpenses)
                                WorkspaceMetric(
                                  label: 'Expenses',
                                  value: _formatMoney(totalExpenses),
                                  detail: 'All recorded expenses',
                                ),
                              if (canViewSales && canViewExpenses)
                                WorkspaceMetric(
                                  label: 'Net profit',
                                  value: _formatMoney(netProfit),
                                  detail: 'Sales minus expenses',
                                ),
                            ],
                          ),
                        ),
                      if (canViewSales || canViewExpenses)
                        const SizedBox(height: 32),

                      // Operational Alerts
                      if (lowStockItems.isNotEmpty ||
                          overdueTasks.isNotEmpty) ...[
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Row(
                            children: [
                              Icon(
                                Icons.error_outline,
                                color: Colors.orange.shade800,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Operational Alerts',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange.shade800,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Low Stock alerts
                        for (var item in lowStockItems.take(2))
                          Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.errorContainer
                                  .withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: theme.colorScheme.error.withValues(
                                  alpha: 0.3,
                                ),
                              ),
                            ),
                            child: ListTile(
                              leading: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.red.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.warning_amber_rounded,
                                  color: Colors.red,
                                ),
                              ),
                              title: Text(
                                item.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              subtitle: Text(
                                'Only ${item.stockLevel} left (Threshold: ${item.lowStockLevel})',
                              ),
                              trailing:
                                  AuthService.hasPermission('manageInventory')
                                  ? FilledButton.tonal(
                                      style: FilledButton.styleFrom(
                                        visualDensity: VisualDensity.compact,
                                      ),
                                      onPressed: () => Navigator.pushNamed(
                                        context,
                                        '/inventory',
                                      ),
                                      child: const Text('Receive'),
                                    )
                                  : null,
                            ),
                          ),

                        // Overdue Tasks alert
                        for (var t in overdueTasks.take(1))
                          Container(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.amber.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.amber.withValues(alpha: 0.3),
                              ),
                            ),
                            child: ListTile(
                              leading: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.amber.withValues(alpha: 0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.alarm,
                                  color: Colors.amber,
                                ),
                              ),
                              title: Text(
                                t.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              subtitle: Text(
                                'OVERDUE - Assigned to: ${t.assignedToName}',
                              ),
                              trailing: IconButton(
                                icon: const Icon(
                                  Icons.arrow_forward_ios,
                                  size: 16,
                                ),
                                onPressed: () =>
                                    Navigator.pushNamed(context, '/tasks'),
                              ),
                            ),
                          ),
                        const SizedBox(height: 32),
                      ],

                      // Visual Chart
                      if (AuthService.hasPermission('viewReports')) ...[
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Text(
                            'Revenue and expenses',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          height: 220,
                          margin: const EdgeInsets.symmetric(horizontal: 20),
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: theme.colorScheme.outlineVariant,
                            ),
                          ),
                          child:
                              transaction.sales.isEmpty &&
                                  transaction.expenses.isEmpty
                              ? Center(
                                  child: Text(
                                    'No transaction data yet.',
                                    style: theme.textTheme.bodyMedium?.copyWith(
                                      color: Colors.grey,
                                    ),
                                  ),
                                )
                              : BarChart(
                                  BarChartData(
                                    alignment: BarChartAlignment.spaceAround,
                                    maxY:
                                        (totalSales > totalExpenses
                                            ? totalSales
                                            : totalExpenses) *
                                        1.3,
                                    barTouchData: BarTouchData(
                                      enabled: true,
                                      touchTooltipData: BarTouchTooltipData(
                                        getTooltipItem:
                                            (group, groupIndex, rod, rodIndex) {
                                              return BarTooltipItem(
                                                _formatMoney(rod.toY),
                                                const TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              );
                                            },
                                      ),
                                    ),
                                    titlesData: FlTitlesData(
                                      show: true,
                                      bottomTitles: AxisTitles(
                                        sideTitles: SideTitles(
                                          showTitles: true,
                                          getTitlesWidget:
                                              (double value, TitleMeta meta) {
                                                final style = theme
                                                    .textTheme
                                                    .labelMedium
                                                    ?.copyWith(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    );
                                                String text = value.toInt() == 0
                                                    ? 'Revenue'
                                                    : 'Expenses';
                                                return SideTitleWidget(
                                                  meta: meta,
                                                  space: 8,
                                                  child: Text(
                                                    text,
                                                    style: style,
                                                  ),
                                                );
                                              },
                                        ),
                                      ),
                                      leftTitles: const AxisTitles(
                                        sideTitles: SideTitles(
                                          showTitles: false,
                                        ),
                                      ),
                                      rightTitles: const AxisTitles(
                                        sideTitles: SideTitles(
                                          showTitles: false,
                                        ),
                                      ),
                                      topTitles: const AxisTitles(
                                        sideTitles: SideTitles(
                                          showTitles: false,
                                        ),
                                      ),
                                    ),
                                    gridData: FlGridData(
                                      show: true,
                                      drawVerticalLine: false,
                                      horizontalInterval:
                                          (totalSales > totalExpenses
                                                      ? totalSales
                                                      : totalExpenses) /
                                                  3 >
                                              0
                                          ? (totalSales > totalExpenses
                                                    ? totalSales
                                                    : totalExpenses) /
                                                3
                                          : 100,
                                      getDrawingHorizontalLine: (value) =>
                                          FlLine(
                                            color: theme
                                                .colorScheme
                                                .outlineVariant
                                                .withValues(alpha: 0.5),
                                            strokeWidth: 1,
                                            dashArray: [5, 5],
                                          ),
                                    ),
                                    borderData: FlBorderData(show: false),
                                    barGroups: [
                                      BarChartGroupData(
                                        x: 0,
                                        barRods: [
                                          BarChartRodData(
                                            toY: totalSales,
                                            color: theme.colorScheme.primary,
                                            width: 40,
                                            borderRadius:
                                                const BorderRadius.vertical(
                                                  top: Radius.circular(8),
                                                ),
                                            backDrawRodData:
                                                BackgroundBarChartRodData(
                                                  show: true,
                                                  toY:
                                                      (totalSales >
                                                              totalExpenses
                                                          ? totalSales
                                                          : totalExpenses) *
                                                      1.3,
                                                  color: theme
                                                      .colorScheme
                                                      .surfaceContainerHighest,
                                                ),
                                          ),
                                        ],
                                      ),
                                      BarChartGroupData(
                                        x: 1,
                                        barRods: [
                                          BarChartRodData(
                                            toY: totalExpenses,
                                            color: theme
                                                .colorScheme
                                                .onSurfaceVariant,
                                            width: 40,
                                            borderRadius:
                                                const BorderRadius.vertical(
                                                  top: Radius.circular(8),
                                                ),
                                            backDrawRodData:
                                                BackgroundBarChartRodData(
                                                  show: true,
                                                  toY:
                                                      (totalSales >
                                                              totalExpenses
                                                          ? totalSales
                                                          : totalExpenses) *
                                                      1.3,
                                                  color: theme
                                                      .colorScheme
                                                      .surfaceContainerHighest,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                        ),
                        const SizedBox(height: 32),
                      ],

                      // Quick Actions Grid
                      if (quickActions.isNotEmpty) ...[
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Text(
                            'Quick actions',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        LayoutBuilder(
                          builder: (context, constraints) {
                            final columns =
                                MediaQuery.textScalerOf(context).scale(14) > 20
                                ? 1
                                : constraints.maxWidth >= 760
                                ? 3
                                : 2;
                            final actionHeight =
                                80 + MediaQuery.textScalerOf(context).scale(36);

                            return GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                              ),
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: columns,
                                    mainAxisSpacing: 16,
                                    crossAxisSpacing: 16,
                                    mainAxisExtent: actionHeight,
                                  ),
                              itemCount: quickActions.length,
                              itemBuilder: (context, index) {
                                final action = quickActions[index];
                                return Material(
                                  color: theme.colorScheme.surface,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    side: BorderSide(
                                      color: theme.colorScheme.outlineVariant,
                                    ),
                                  ),
                                  clipBehavior: Clip.antiAlias,
                                  child: InkWell(
                                    onTap: () => Navigator.pushNamed(
                                      context,
                                      action.route,
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Icon(
                                            action.icon,
                                            size: 22,
                                            color: theme.colorScheme.primary,
                                          ),
                                          const SizedBox(height: 10),
                                          Text(
                                            action.label,
                                            style: theme.textTheme.titleSmall,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                        const SizedBox(height: 32),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: 0,
          onDestinationSelected: (index) {
            if (index != 0) {
              Navigator.pushNamed(context, navigationItems[index].route);
            }
          },
          destinations: navigationItems
              .map(
                (item) => NavigationDestination(
                  icon: Icon(item.icon),
                  label: item.label,
                ),
              )
              .toList(),
        ),
      ),
    );
  }

  Widget _heroMetric(String value, String label) => Expanded(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: Theme.of(context).textTheme.titleLarge),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    ),
  );

  String _formatMoney(double value) {
    final amount = NumberFormat.decimalPattern('en').format(value.round());
    return 'FCFA $amount';
  }
}

class _QuickActionData {
  final String label;
  final IconData icon;
  final String route;

  _QuickActionData(this.label, this.icon, this.route);
}

class _NavigationItem {
  final String label;
  final IconData icon;
  final String route;

  const _NavigationItem(this.label, this.icon, this.route);
}
