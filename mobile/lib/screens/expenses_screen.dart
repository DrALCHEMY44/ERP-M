import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/expense.dart';
import '../providers/core_provider.dart';
import '../providers/transaction_provider.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';

class ExpensesScreen extends StatefulWidget {
  const ExpensesScreen({super.key});

  @override
  State<ExpensesScreen> createState() => _ExpensesScreenState();
}

class _ExpensesScreenState extends State<ExpensesScreen> {
  static const _categories = [
    'Rent',
    'Utilities',
    'Salaries',
    'Supplies',
    'Marketing',
    'Transport',
    'Taxes',
    'Other',
  ];

  void _message(String message, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: error ? Colors.red : null,
      ),
    );
  }

  Future<void> _showAddExpenseDialog() async {
    final transactionProvider = context.read<TransactionProvider>();
    final coreProvider = context.read<CoreProvider>();
    final description = TextEditingController();
    final amount = TextEditingController();
    var category = 'Utilities';
    var date = DateTime.now();
    PlatformFile? receipt;
    final formKey = GlobalKey<FormState>();
    final submit = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Record expense',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: category,
                    decoration: const InputDecoration(labelText: 'Category'),
                    items: _categories
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) =>
                        setSheetState(() => category = value ?? 'Other'),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: description,
                    maxLines: 2,
                    decoration: const InputDecoration(labelText: 'Description'),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Required'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: amount,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Amount (FCFA)',
                    ),
                    validator: (value) =>
                        (double.tryParse(value ?? '') ?? 0) <= 0
                        ? 'Enter a positive amount'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  if (AuthService.hasPermission('manageDocuments'))
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.calendar_today_outlined),
                      title: const Text('Expense date'),
                      subtitle: Text(date.toString().split(' ').first),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          firstDate: DateTime(2000),
                          lastDate: DateTime.now(),
                          initialDate: date,
                        );
                        if (picked != null) setSheetState(() => date = picked);
                      },
                    ),
                  if (!AuthService.hasPermission('manageDocuments'))
                    const ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(Icons.info_outline),
                      title: Text('Receipt upload unavailable for this role'),
                      subtitle: Text(
                        'The expense can still be recorded normally.',
                      ),
                    ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.receipt_long_outlined),
                    title: Text(receipt?.name ?? 'Attach receipt (optional)'),
                    subtitle: Text(
                      receipt == null
                          ? 'PDF or image, maximum 25 MB'
                          : 'Ready to upload',
                    ),
                    trailing: receipt == null
                        ? const Icon(Icons.attach_file)
                        : IconButton(
                            onPressed: () =>
                                setSheetState(() => receipt = null),
                            icon: const Icon(Icons.close),
                          ),
                    onTap: () async {
                      final picked = await FilePicker.pickFile(
                        type: FileType.custom,
                        allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
                      );
                      if (picked != null) setSheetState(() => receipt = picked);
                    },
                  ),
                  const SizedBox(height: 14),
                  FilledButton.icon(
                    onPressed: () {
                      if (formKey.currentState!.validate()) {
                        Navigator.pop(sheetContext, true);
                      }
                    },
                    icon: const Icon(Icons.save_outlined),
                    label: const Text('Save expense'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    if (!mounted) return;
    if (submit == true) {
      String? receiptUrl;
      try {
        if (receipt != null) {
          final uploaded = await ApiService.uploadFile(receipt!);
          receiptUrl = uploaded['fileUrl']?.toString();
        }
        final success = await transactionProvider.recordExpense(
          category,
          description.text.trim(),
          double.parse(amount.text),
          coreProvider,
          date: date,
          receiptUrl: receiptUrl,
        );
        _message(
          success
              ? 'Expense recorded.'
              : 'You are not allowed to record expenses.',
          error: !success,
        );
      } catch (error) {
        if (receiptUrl != null) {
          try {
            await ApiService.deleteManagedFile(receiptUrl);
          } catch (_) {}
        }
        _message(error.toString(), error: true);
      }
    }
    description.dispose();
    amount.dispose();
  }

  Future<void> _downloadReceipt(Expense expense) async {
    if (expense.receiptUrl == null) return;
    try {
      final file = await ApiService.downloadFile(expense.receiptUrl!);
      await ExportService.saveBytes('receipt_${expense.id}', file.bytes);
      _message('Receipt saved.');
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _delete(Expense expense) async {
    final transactionProvider = context.read<TransactionProvider>();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete expense?'),
        content: Text('Delete “${expense.description}”?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (!mounted) return;
    if (confirmed != true) return;
    try {
      await transactionProvider.deleteExpense(expense.id);
      if (expense.receiptUrl != null) {
        try {
          await ApiService.deleteManagedFile(expense.receiptUrl!);
        } catch (_) {}
      }
      _message('Expense deleted.');
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _export(List<Expense> expenses) async {
    await ExportService.saveCsv('smarterp_expenses.csv', [
      ['Date', 'Category', 'Description', 'Amount', 'Recorded by', 'Receipt'],
      ...expenses.map(
        (item) => [
          item.date.toIso8601String(),
          item.category,
          item.description,
          item.amount,
          item.recordedBy,
          item.receiptUrl,
        ],
      ),
    ]);
    _message('Expense export saved.');
  }

  @override
  Widget build(BuildContext context) {
    final transaction = context.watch<TransactionProvider>();
    final expenses = transaction.expenses;
    final canManage = AuthService.hasPermission('manageExpenses');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business expenses'),
        actions: [
          IconButton(
            onPressed: () => _export(expenses),
            tooltip: 'Export CSV',
            icon: const Icon(Icons.download_outlined),
          ),
          IconButton(
            onPressed: transaction.loadData,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/expenses'),
      body: expenses.isEmpty
          ? const Center(child: Text('No expenses recorded yet.'))
          : RefreshIndicator(
              onRefresh: transaction.loadData,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: expenses.length,
                itemBuilder: (context, index) {
                  final item = expenses[index];
                  return Card(
                    child: ListTile(
                      leading: const CircleAvatar(
                        child: Icon(Icons.money_off_outlined),
                      ),
                      title: Text(
                        item.description,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        '${item.category} • ${item.date.toString().split(' ').first}\nRecorded by ${item.recordedBy}',
                      ),
                      isThreeLine: true,
                      onTap: item.receiptUrl == null
                          ? null
                          : () => _downloadReceipt(item),
                      trailing: canManage
                          ? PopupMenuButton<String>(
                              onSelected: (value) => value == 'receipt'
                                  ? _downloadReceipt(item)
                                  : _delete(item),
                              itemBuilder: (_) => [
                                if (item.receiptUrl != null)
                                  const PopupMenuItem(
                                    value: 'receipt',
                                    child: Text('Download receipt'),
                                  ),
                                const PopupMenuItem(
                                  value: 'delete',
                                  child: Text('Delete'),
                                ),
                              ],
                            )
                          : Text(
                              'FCFA ${item.amount.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: canManage
          ? FloatingActionButton.extended(
              onPressed: _showAddExpenseDialog,
              icon: const Icon(Icons.add),
              label: const Text('Expense'),
            )
          : null,
    );
  }
}
