import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class ExpensesScreen extends StatefulWidget {
  const ExpensesScreen({super.key});

  @override
  State<ExpensesScreen> createState() => _ExpensesScreenState();
}

class _ExpensesScreenState extends State<ExpensesScreen> {
  final _descController = TextEditingController();
  final _amountController = TextEditingController();
  String _selectedCategory = 'Utilities';

  final List<String> _categories = [
    'Rent', 'Utilities', 'Salaries', 'Supplies', 'Marketing', 'Transport', 'Taxes', 'Other'
  ];

  void _showAddExpenseDialog() {
    _descController.clear();
    _amountController.clear();
    _selectedCategory = 'Utilities';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final theme = Theme.of(context);
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 20, right: 20, top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Record Expense',
                style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              
              // Category Dropdown
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) {
                  _selectedCategory = val ?? 'Other';
                },
              ),
              const SizedBox(height: 12),
              
              // Description
              TextField(
                controller: _descController,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              
              // Amount
              TextField(
                controller: _amountController,
                decoration: const InputDecoration(labelText: 'Amount (FCFA)', border: OutlineInputBorder()),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 24),
              
              FilledButton(
                onPressed: () async {
                  final amount = double.tryParse(_amountController.text) ?? 0;
                  if (amount <= 0 || _descController.text.trim().isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please enter a valid description and amount.')),
                    );
                    return;
                  }

                  final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
                  final success = await transaction.recordExpense(
                    _selectedCategory,
                    _descController.text,
                    amount,
                    core,
                  );

                  if (context.mounted) {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(success ? 'Expense recorded successfully!' : 'Failed: Unauthorized access.'),
                        backgroundColor: success ? Colors.green : Colors.red,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                child: const Text('Save Expense'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final expensesList = transaction.expenses;

    return Scaffold(
      appBar: AppBar(title: const Text('Business Expenses')),
      drawer: const AppDrawer(currentRoute: '/expenses'),
      body: expensesList.isEmpty
          ? const Center(
              child: Text('No expenses recorded yet.'),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: expensesList.length,
              itemBuilder: (context, index) {
                final exp = expensesList[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.red.shade100,
                      child: const Icon(Icons.money_off, color: Colors.red),
                    ),
                    title: Text(
                      exp.description,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Category: ${exp.category} • Recorded by ${exp.recordedBy}'),
                        Text(
                          'Date: ${exp.date.toString().split(' ')[0]}',
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                    trailing: Text(
                      'FCFA ${exp.amount.toInt()}',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.red.shade800,
                      ),
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: AuthService.hasPermission('manageExpenses')
          ? FloatingActionButton(
              onPressed: _showAddExpenseDialog,
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }
}
