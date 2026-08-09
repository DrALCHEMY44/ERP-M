import 'package:flutter/foundation.dart';

import '../models/expense.dart';
import '../models/sale.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'core_provider.dart';
import 'inventory_provider.dart';

class TransactionProvider with ChangeNotifier {
  final List<Sale> _sales = [];
  final List<Expense> _expenses = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  List<Sale> get sales => List.unmodifiable(_sales);
  List<Expense> get expenses => List.unmodifiable(_expenses);

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  Future<Map<String, dynamic>> _dataOperation(
    String operation, [
    Map<String, dynamic> variables = const {},
  ]) {
    return ApiService.request(
      '/api/data',
      method: 'POST',
      body: {'operation': operation, 'variables': variables},
    );
  }

  Future<void> loadData() async {
    if (AuthService.currentUser == null) return;
    setLoading(true);
    try {
      final response = await _dataOperation('listTransactionsByBusiness');
      final data = response['data'] as Map<String, dynamic>;
      final rows = data['transactions'] as List<dynamic>? ?? [];
      _sales.clear();
      _expenses.clear();
      for (final value in rows) {
        final row = value as Map<String, dynamic>;
        final date = DateTime.parse(row['date'] as String);
        final amount = (row['amount'] as num).toDouble();
        if (row['type'] == 'SALE') {
          _sales.add(
            Sale(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              itemName: row['category'] as String? ?? 'Sale',
              quantity: 1,
              totalAmount: amount,
              date: date,
              recordedBy: row['recordedBy'] as String,
            ),
          );
        } else if (row['type'] == 'EXPENSE') {
          _expenses.add(
            Expense(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              category: row['category'] as String? ?? 'Other',
              description: 'Operational expense',
              amount: amount,
              date: date,
              recordedBy: row['recordedBy'] as String,
            ),
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }

  Future<bool> recordSale(
    String productId,
    int quantity,
    CoreProvider core,
    InventoryProvider inventory,
  ) async {
    if (!AuthService.hasPermission('manageSales')) return false;
    setLoading(true);
    try {
      await ApiService.request(
        '/api/sales',
        method: 'POST',
        body: {
          'idempotencyKey':
              '${AuthService.currentUser!.id}-${DateTime.now().microsecondsSinceEpoch}',
          'paymentMethod': 'CASH',
          'items': [
            {'productId': productId, 'quantity': quantity},
          ],
        },
      );
      await Future.wait([loadData(), inventory.loadData()]);
      return true;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> recordExpense(
    String category,
    String description,
    double amount,
    CoreProvider core,
  ) async {
    if (!AuthService.hasPermission('manageExpenses')) return false;
    setLoading(true);
    try {
      await _dataOperation('CreateTransaction', {
        'type': 'EXPENSE',
        'amount': amount,
        'date': DateTime.now().toUtc().toIso8601String(),
        'category': category,
      });
      await loadData();
      return true;
    } finally {
      setLoading(false);
    }
  }
}
