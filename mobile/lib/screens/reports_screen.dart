import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  bool _isGeneratingPdf = false;

  void _simulatePdfGeneration() async {
    setState(() {
      _isGeneratingPdf = true;
    });

    final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    core.logActivity('GENERATE_REPORT', 'Reports', 'Generated Cameroon SYSCOHADA financial compliance report PDF.');

    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _isGeneratingPdf = false;
      });

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.picture_as_pdf, color: Colors.red),
              SizedBox(width: 8),
              Text('PDF Report Generated'),
            ],
          ),
          content: const Text(
            'SYSCOHADA Standard Balance Sheet & Income Statement PDF generated successfully. '
            'File saved to local storage:\n\n/Documents/SmartERP_SYSCOHADA_Report.pdf',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening PDF viewer...'), behavior: SnackBarBehavior.floating),
                );
              },
              child: const Text('Open File'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);

    // Calculations
    final double totalSales = transaction.sales.fold(0.0, (sum, item) => sum + item.totalAmount);
    final double totalExpenses = transaction.expenses.fold(0.0, (sum, item) => sum + item.amount);
    final double profit = totalSales - totalExpenses;
    
    // Low stock count
    final int lowStockCount = inventory.inventory.where((p) => p.stockLevel <= p.lowStockLevel).length;

    // Cameroon Tax calculations (VAT: 19.25% standard rate)
    final double estimatedVatCollected = totalSales * 0.1925;

    // Top selling items calculations for PieChart
    final Map<String, int> productSales = {};
    for (var sale in transaction.sales) {
      productSales[sale.itemName] = (productSales[sale.itemName] ?? 0) + sale.quantity;
    }
    
    final List<PieChartSectionData> pieSections = [];
    final colors = [Colors.blue, Colors.teal, Colors.orange, Colors.purple, Colors.red];
    int colorIdx = 0;
    
    productSales.forEach((productName, qty) {
      pieSections.add(PieChartSectionData(
        value: qty.toDouble(),
        title: '$productName ($qty)',
        color: colors[colorIdx % colors.length],
        radius: 60,
        titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
      ));
      colorIdx++;
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Business Reports')),
      drawer: const AppDrawer(currentRoute: '/reports'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header stats
            Row(
              children: [
                Expanded(
                  child: _metricCard('Gross Income', 'FCFA ${totalSales.toInt()}', Colors.green, theme),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _metricCard('Operational Expenses', 'FCFA ${totalExpenses.toInt()}', Colors.red, theme),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: profit >= 0 ? Colors.green.shade50 : Colors.red.shade50,
                      child: Icon(
                        profit >= 0 ? Icons.account_balance : Icons.money_off,
                        color: profit >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Net Business Profit', style: theme.textTheme.bodySmall),
                        Text(
                          'FCFA ${profit.toInt()}',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: profit >= 0 ? Colors.green.shade700 : Colors.red.shade700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Top Products PieChart
            Text('Sales Breakdown by Item', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              height: 200,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5)),
              ),
              child: pieSections.isEmpty
                  ? const Center(child: Text('No product sales logs recorded yet.'))
                  : PieChart(
                      PieChartData(
                        sections: pieSections,
                        centerSpaceRadius: 40,
                        sectionsSpace: 2,
                      ),
                    ),
            ),
            const SizedBox(height: 20),

            // Cameroon Compliance Section
            Text('SYSCOHADA & Cameroon Tax Estimates', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              elevation: 0,
              color: theme.colorScheme.secondaryContainer.withValues(alpha: 0.2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: theme.colorScheme.secondary.withValues(alpha: 0.2)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _complianceRow('Standard Cameroon VAT (19.25%)', 'FCFA ${estimatedVatCollected.toInt()}'),
                    const Divider(height: 16),
                    _complianceRow('SYSCOHADA Standard Journal Logs', '${transaction.sales.length + transaction.expenses.length} Records'),
                    const Divider(height: 16),
                    _complianceRow('Low Stock Risk Products', '$lowStockCount Items'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // PDF Action Button
            FilledButton.icon(
              onPressed: _isGeneratingPdf ? null : _simulatePdfGeneration,
              icon: _isGeneratingPdf 
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Icon(Icons.picture_as_pdf),
              label: Text(_isGeneratingPdf ? 'Generating SYSCOHADA Report...' : 'Export Compliance PDF Report'),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _metricCard(String title, String value, Color color, ThemeData theme) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey.shade600)),
            const SizedBox(height: 4),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: color,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _complianceRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.teal, fontSize: 13)),
      ],
    );
  }
}
