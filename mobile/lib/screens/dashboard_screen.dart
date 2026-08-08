import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/services.dart';
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

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  DateTime? _lastBackPressed;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
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

    // Financial calculations
    final double totalSales = transaction.sales.fold(0.0, (sum, item) => sum + item.totalAmount);
    final double totalExpenses = transaction.expenses.fold(0.0, (sum, item) => sum + item.amount);
    final double netProfit = totalSales - totalExpenses;

    // Low stock warnings
    final lowStockItems = inventory.inventory.where((item) => item.stockLevel <= item.lowStockLevel).toList();

    // Overdue tasks
    final overdueTasks = taskProvider.tasks.where((t) => t.isOverdue).toList();

    // Quick Actions grid based on permissions
    final List<_QuickActionData> quickActions = [];
    if (AuthService.hasPermission('manageSales')) {
      quickActions.add(_QuickActionData('Record Sale', Icons.add_shopping_cart, Colors.green, '/sales'));
    }
    if (AuthService.hasPermission('manageExpenses')) {
      quickActions.add(_QuickActionData('Record Expense', Icons.remove_circle_outline, Colors.red, '/expenses'));
    }
    if (AuthService.hasPermission('manageTasks')) {
      quickActions.add(_QuickActionData('New Task', Icons.add_task, Colors.orange, '/assign-task'));
    }
    quickActions.add(_QuickActionData('AI Assistant', Icons.psychology, Colors.purple, '/ai-assistant'));
    quickActions.add(_QuickActionData('Customers', Icons.people, Colors.blue, '/customers'));
    quickActions.add(_QuickActionData('Employees', Icons.badge, Colors.indigo, '/employees'));

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        final now = DateTime.now();
        final shouldExit = _lastBackPressed != null &&
            now.difference(_lastBackPressed!) < const Duration(seconds: 2);
        if (shouldExit) {
          SystemNavigator.pop();
          return;
        }
        _lastBackPressed = now;
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(const SnackBar(
            content: Text('Press back again to exit SmartERP'),
            duration: Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
          ));
      },
      child: Scaffold(
      appBar: AppBar(
        title: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('SmartERP', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
          Text('BUSINESS COMMAND CENTER', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 8, letterSpacing: 1.4)),
        ]),
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
                      constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                      child: Text(
                        '${core.unreadNotifications.length}',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF172554), Color(0xFF1E3A8A), Color(0xFF4F46E5)]),
                    borderRadius: BorderRadius.circular(26),
                    boxShadow: [BoxShadow(color: const Color(0xFF1E3A8A).withValues(alpha: .22), blurRadius: 24, offset: const Offset(0, 12))],
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      Expanded(child: Text('Welcome back, ${user?.name.split(" ")[0] ?? "User"}', style: theme.textTheme.headlineSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.w900))),
                      Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: Colors.white.withValues(alpha: .12), borderRadius: BorderRadius.circular(20)), child: const Row(children: [Icon(Icons.cloud_done_outlined, size: 14, color: Color(0xFF86EFAC)), SizedBox(width: 5), Text('LIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800))])),
                    ]),
                    const SizedBox(height: 7),
                    Text('${user?.role.displayName ?? "Member"} • ${user?.businessCode}', style: const TextStyle(color: Color(0xFFCBD5E1), fontWeight: FontWeight.w500)),
                    const SizedBox(height: 20),
                    Row(children: [
                      _heroMetric('${inventory.inventory.length}', 'Products'),
                      _heroMetric('${taskProvider.tasks.length}', 'Tasks'),
                      _heroMetric('${core.unreadNotifications.length}', 'Alerts'),
                    ]),
                  ]),
                ),
                const SizedBox(height: 32),
                
                // Financial Stats Cards
                SizedBox(
                  height: 140,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    children: [
                      _statCard('Revenue', 'FCFA ${totalSales.toInt()}', Icons.trending_up, Colors.green, theme, 0),
                      _statCard('Expenses', 'FCFA ${totalExpenses.toInt()}', Icons.trending_down, Colors.red, theme, 100),
                      _statCard('Net Profit', 'FCFA ${netProfit.toInt()}', netProfit >= 0 ? Icons.account_balance_wallet : Icons.money_off, netProfit >= 0 ? Colors.blue : Colors.deepOrange, theme, 200),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Operational Alerts
                if (lowStockItems.isNotEmpty || overdueTasks.isNotEmpty) ...[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, color: Colors.orange.shade800, size: 20),
                        const SizedBox(width: 8),
                        Text('Operational Alerts', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: Colors.orange.shade800)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  // Low Stock alerts
                  for (var item in lowStockItems.take(2))
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: theme.colorScheme.error.withValues(alpha: 0.3)),
                      ),
                      child: ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.1), shape: BoxShape.circle),
                          child: const Icon(Icons.warning_amber_rounded, color: Colors.red),
                        ),
                        title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Only ${item.stockLevel} left (Threshold: ${item.lowStockLevel})'),
                        trailing: FilledButton.tonal(
                          style: FilledButton.styleFrom(visualDensity: VisualDensity.compact),
                          onPressed: () {
                            inventory.reorderProduct(item.id, core);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Reordered 50 units of ${item.name}')),
                            );
                          },
                          child: const Text('Reorder'),
                        ),
                      ),
                    ),

                  // Overdue Tasks alert
                  for (var t in overdueTasks.take(1))
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.amber.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                      ),
                      child: ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), shape: BoxShape.circle),
                          child: const Icon(Icons.alarm, color: Colors.amber),
                        ),
                        title: Text(t.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('OVERDUE - Assigned to: ${t.assignedToName}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.arrow_forward_ios, size: 16),
                          onPressed: () => Navigator.pushNamed(context, '/tasks'),
                        ),
                      ),
                    ),
                  const SizedBox(height: 32),
                ],

                // Visual Chart
                if (AuthService.hasPermission('viewReports')) ...[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    child: Text('Performance Overview', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    height: 220,
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.03),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        )
                      ],
                    ),
                    child: transaction.sales.isEmpty && transaction.expenses.isEmpty
                        ? Center(child: Text('No transaction data yet.', style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey)))
                        : BarChart(
                            BarChartData(
                              alignment: BarChartAlignment.spaceAround,
                              maxY: (totalSales > totalExpenses ? totalSales : totalExpenses) * 1.3,
                              barTouchData: BarTouchData(
                                enabled: true,
                                touchTooltipData: BarTouchTooltipData(
                                  getTooltipItem: (group, groupIndex, rod, rodIndex) {
                                    return BarTooltipItem(
                                      'FCFA ${rod.toY.toInt()}',
                                      const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                    );
                                  },
                                ),
                              ),
                              titlesData: FlTitlesData(
                                show: true,
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    getTitlesWidget: (double value, TitleMeta meta) {
                                      final style = theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold);
                                      String text = value.toInt() == 0 ? 'Revenue' : 'Expenses';
                                      return SideTitleWidget(meta: meta, space: 8, child: Text(text, style: style));
                                    },
                                  ),
                                ),
                                leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                              gridData: FlGridData(
                                show: true,
                                drawVerticalLine: false,
                                horizontalInterval: (totalSales > totalExpenses ? totalSales : totalExpenses) / 3 > 0 
                                  ? (totalSales > totalExpenses ? totalSales : totalExpenses) / 3 
                                  : 100,
                                getDrawingHorizontalLine: (value) => FlLine(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5), strokeWidth: 1, dashArray: [5, 5]),
                              ),
                              borderData: FlBorderData(show: false),
                              barGroups: [
                                BarChartGroupData(
                                  x: 0,
                                  barRods: [
                                    BarChartRodData(
                                      toY: totalSales,
                                      gradient: const LinearGradient(colors: [Colors.green, Colors.lightGreenAccent], begin: Alignment.bottomCenter, end: Alignment.topCenter),
                                      width: 40,
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                      backDrawRodData: BackgroundBarChartRodData(show: true, toY: (totalSales > totalExpenses ? totalSales : totalExpenses) * 1.3, color: theme.colorScheme.surfaceContainerHighest),
                                    )
                                  ],
                                ),
                                BarChartGroupData(
                                  x: 1,
                                  barRods: [
                                    BarChartRodData(
                                      toY: totalExpenses,
                                      gradient: const LinearGradient(colors: [Colors.red, Colors.orangeAccent], begin: Alignment.bottomCenter, end: Alignment.topCenter),
                                      width: 40,
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                      backDrawRodData: BackgroundBarChartRodData(show: true, toY: (totalSales > totalExpenses ? totalSales : totalExpenses) * 1.3, color: theme.colorScheme.surfaceContainerHighest),
                                    )
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
                    child: Text('Quick Actions', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 1.8,
                    ),
                    itemCount: quickActions.length,
                    itemBuilder: (context, index) {
                      final action = quickActions[index];
                      return TweenAnimationBuilder(
                        duration: Duration(milliseconds: 400 + (index * 100)),
                        curve: Curves.easeOutBack,
                        tween: Tween<double>(begin: 0.8, end: 1.0),
                        builder: (context, val, child) => Transform.scale(
                          scale: val,
                          child: child,
                        ),
                        child: InkWell(
                          onTap: () => Navigator.pushNamed(context, action.route),
                          borderRadius: BorderRadius.circular(20),
                          child: Ink(
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surface,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: action.color.withValues(alpha: 0.1),
                                  blurRadius: 15,
                                  offset: const Offset(0, 5),
                                )
                              ],
                              border: Border.all(color: action.color.withValues(alpha: 0.2)),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: action.color.withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(action.icon, color: action.color, size: 20),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    action.label,
                                    style: TextStyle(
                                      color: theme.colorScheme.onSurface,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
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
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (index) {
          const routes = ['/dashboard', '/sales', '/inventory', '/tasks', '/ai-assistant'];
          if (index != 0) Navigator.pushNamed(context, routes[index]);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.point_of_sale_outlined), label: 'Sales'),
          NavigationDestination(icon: Icon(Icons.inventory_2_outlined), label: 'Stock'),
          NavigationDestination(icon: Icon(Icons.task_alt_outlined), label: 'Tasks'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), label: 'AI'),
        ],
      ),
      ),
    );
  }

  Widget _heroMetric(String value, String label) => Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20)), Text(label.toUpperCase(), style: const TextStyle(color: Color(0xFF93C5FD), fontWeight: FontWeight.w700, fontSize: 9, letterSpacing: .8))]));

  Widget _statCard(String title, String value, IconData icon, MaterialColor color, ThemeData theme, int delay) {
    return TweenAnimationBuilder(
      duration: Duration(milliseconds: 500 + delay),
      curve: Curves.easeOutCubic,
      tween: Tween<double>(begin: 20.0, end: 0.0),
      builder: (context, val, child) {
        return Transform.translate(
          offset: Offset(val, 0),
          child: Opacity(
            opacity: 1 - (val / 20),
            child: child,
          ),
        );
      },
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.08),
              blurRadius: 20,
              offset: const Offset(0, 8),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: Icon(icon, color: color, size: 22),
                ),
              ],
            ),
            const Spacer(),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                value,
                style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -0.5),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: theme.textTheme.labelMedium?.copyWith(color: Colors.grey.shade600, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionData {
  final String label;
  final IconData icon;
  final MaterialColor color;
  final String route;

  _QuickActionData(this.label, this.icon, this.color, this.route);
}
