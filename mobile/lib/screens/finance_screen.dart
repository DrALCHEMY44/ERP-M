import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/transaction_provider.dart';
import '../services/auth_service.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';

class FinanceScreen extends StatelessWidget {
  const FinanceScreen({super.key});

  Future<void> _export(
    BuildContext context,
    TransactionProvider provider,
  ) async {
    final rows = <List<Object?>>[
      [
        'Type',
        'Date',
        'Description',
        'Category / payment',
        'Amount',
        'Recorded by',
      ],
      ...provider.sales.map(
        (sale) => [
          'Sale',
          sale.date.toIso8601String(),
          sale.itemName,
          sale.paymentMethod,
          sale.totalAmount,
          sale.recordedBy,
        ],
      ),
      ...provider.expenses.map(
        (expense) => [
          'Expense',
          expense.date.toIso8601String(),
          expense.description,
          expense.category,
          -expense.amount,
          expense.recordedBy,
        ],
      ),
    ];
    await ExportService.saveCsv(
      'smarterp_finance_${DateTime.now().toIso8601String().split('T').first}.csv',
      rows,
    );
    if (context.mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Finance export saved.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<TransactionProvider>();
    final revenue = data.sales.fold<double>(
      0,
      (sum, sale) => sum + sale.totalAmount,
    );
    final expenses = data.expenses.fold<double>(
      0,
      (sum, expense) => sum + expense.amount,
    );
    final net = revenue - expenses;
    final entries = <_FinanceEntry>[
      ...data.sales.map(
        (sale) => _FinanceEntry(
          sale.date,
          sale.itemName,
          sale.paymentMethod,
          sale.totalAmount,
        ),
      ),
      ...data.expenses.map(
        (expense) => _FinanceEntry(
          expense.date,
          expense.description,
          expense.category,
          -expense.amount,
        ),
      ),
    ]..sort((a, b) => b.date.compareTo(a.date));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Finance'),
        actions: [
          IconButton(
            tooltip: 'Export CSV',
            onPressed: () => _export(context, data),
            icon: const Icon(Icons.download_outlined),
          ),
          IconButton(onPressed: data.loadData, icon: const Icon(Icons.refresh)),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/finance'),
      body: RefreshIndicator(
        onRefresh: data.loadData,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _SummaryCard(
                  'Revenue',
                  revenue,
                  Colors.green,
                  Icons.trending_up,
                ),
                _SummaryCard(
                  'Expenses',
                  expenses,
                  Colors.red,
                  Icons.trending_down,
                ),
                _SummaryCard(
                  'Net cash flow',
                  net,
                  net >= 0 ? Colors.blue : Colors.orange,
                  Icons.account_balance_wallet_outlined,
                ),
              ],
            ),
            const SizedBox(height: 22),
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Transaction ledger',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (AuthService.hasPermission('viewAccounting'))
                  TextButton.icon(
                    onPressed: () =>
                        Navigator.pushNamed(context, '/accounting'),
                    icon: const Icon(Icons.account_balance),
                    label: const Text('Accounting'),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            if (entries.isEmpty)
              const Padding(
                padding: EdgeInsets.all(36),
                child: Center(child: Text('No financial transactions yet.')),
              )
            else
              ...entries.map(
                (entry) => Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          (entry.amount >= 0 ? Colors.green : Colors.red)
                              .withValues(alpha: .12),
                      child: Icon(
                        entry.amount >= 0 ? Icons.south_west : Icons.north_east,
                        color: entry.amount >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                    title: Text(entry.description),
                    subtitle: Text(
                      '${entry.category} • ${entry.date.toLocal().toString().split(' ').first}',
                    ),
                    trailing: Text(
                      '${entry.amount >= 0 ? '+' : '-'} FCFA ${entry.amount.abs().toStringAsFixed(0)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: entry.amount >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _FinanceEntry {
  final DateTime date;
  final String description;
  final String category;
  final double amount;
  const _FinanceEntry(this.date, this.description, this.category, this.amount);
}

class _SummaryCard extends StatelessWidget {
  final String label;
  final double amount;
  final Color color;
  final IconData icon;
  const _SummaryCard(this.label, this.amount, this.color, this.icon);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 190,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color),
              const SizedBox(height: 12),
              Text(label),
              const SizedBox(height: 4),
              Text(
                'FCFA ${amount.toStringAsFixed(0)}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
