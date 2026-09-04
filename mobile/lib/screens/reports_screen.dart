import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../services/api_service.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  bool _generatingReport = false;

  Future<void> _generateReport() async {
    final reportType = await showDialog<String>(
      context: context,
      builder: (context) => SimpleDialog(
        title: const Text('Generate CSV report'),
        children: [
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'sales'),
            child: const Text('Sales'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'expenses'),
            child: const Text('Expenses'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'inventory'),
            child: const Text('Inventory'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'tasks'),
            child: const Text('Tasks'),
          ),
        ],
      ),
    );
    if (reportType == null || !mounted) return;
    setState(() => _generatingReport = true);
    try {
      final result = await ApiService.request(
        '/api/reports/generate',
        method: 'POST',
        body: {'reportType': reportType},
      );
      if (!mounted) return;
      final fileUrl = result['fileUrl']?.toString();
      final filename = result['filename']?.toString() ?? 'report.csv';
      if (fileUrl != null) {
        final file = await ApiService.downloadFile(fileUrl);
        await ExportService.saveBytes(filename, file.bytes);
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '$filename was saved and stored in the private document vault (${result['records'] ?? 0} records).',
          ),
        ),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Report generation failed: $error')),
      );
    } finally {
      if (mounted) setState(() => _generatingReport = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);

    // Calculations
    final double totalSales = transaction.sales.fold(
      0.0,
      (sum, item) => sum + item.totalAmount,
    );
    final double totalExpenses = transaction.expenses.fold(
      0.0,
      (sum, item) => sum + item.amount,
    );
    final double profit = totalSales - totalExpenses;

    // Low stock count
    final int lowStockCount = inventory.inventory
        .where((p) => p.stockLevel <= p.lowStockLevel)
        .length;

    // Top selling items calculations for PieChart
    final Map<String, int> productSales = {};
    for (var sale in transaction.sales) {
      if (sale.items.isEmpty) {
        productSales[sale.itemName] =
            (productSales[sale.itemName] ?? 0) + sale.quantity;
      } else {
        for (final line in sale.items) {
          final baseQuantity = line.quantity * line.conversionFactor;
          productSales[line.productName] =
              (productSales[line.productName] ?? 0) + baseQuantity;
        }
      }
    }

    final List<PieChartSectionData> pieSections = [];
    final colors = [
      Colors.blue,
      Colors.teal,
      Colors.orange,
      Colors.purple,
      Colors.red,
    ];
    int colorIdx = 0;

    productSales.forEach((productName, qty) {
      pieSections.add(
        PieChartSectionData(
          value: qty.toDouble(),
          title: '$productName ($qty)',
          color: colors[colorIdx % colors.length],
          radius: 60,
          titleStyle: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      );
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
                  child: _metricCard(
                    'Gross Income',
                    'FCFA ${totalSales.toInt()}',
                    Colors.green,
                    theme,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _metricCard(
                    'Operational Expenses',
                    'FCFA ${totalExpenses.toInt()}',
                    Colors.red,
                    theme,
                  ),
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
                      backgroundColor: profit >= 0
                          ? Colors.green.shade50
                          : Colors.red.shade50,
                      child: Icon(
                        profit >= 0 ? Icons.account_balance : Icons.money_off,
                        color: profit >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Net Business Profit',
                          style: theme.textTheme.bodySmall,
                        ),
                        Text(
                          'FCFA ${profit.toInt()}',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: profit >= 0
                                ? Colors.green.shade700
                                : Colors.red.shade700,
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
            Text(
              'Sales Breakdown by Item',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              height: 200,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: theme.colorScheme.outlineVariant.withValues(
                    alpha: 0.5,
                  ),
                ),
              ),
              child: pieSections.isEmpty
                  ? const Center(
                      child: Text('No product sales logs recorded yet.'),
                    )
                  : PieChart(
                      PieChartData(
                        sections: pieSections,
                        centerSpaceRadius: 40,
                        sectionsSpace: 2,
                      ),
                    ),
            ),
            const SizedBox(height: 20),

            // Operational reporting inputs
            Text(
              'Operational Reporting Inputs',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Card(
              elevation: 0,
              color: theme.colorScheme.secondaryContainer.withValues(
                alpha: 0.2,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(
                  color: theme.colorScheme.secondary.withValues(alpha: 0.2),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _complianceRow(
                      'Source transaction records',
                      '${transaction.sales.length + transaction.expenses.length} Records',
                    ),
                    const Divider(height: 16),
                    _complianceRow(
                      'Low Stock Risk Products',
                      '$lowStockCount Items',
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Operational summary only. Configure and verify tax treatment with a qualified accountant before filing.',
                      style: theme.textTheme.bodySmall,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Server-generated report action
            FilledButton.icon(
              onPressed: _generatingReport ? null : _generateReport,
              icon: _generatingReport
                  ? const SizedBox.square(
                      dimension: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.download),
              label: Text(
                _generatingReport
                    ? 'Generating report…'
                    : 'Generate & store CSV report',
              ),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
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
            Text(
              title,
              style: theme.textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade600,
              ),
            ),
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
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.teal,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}
