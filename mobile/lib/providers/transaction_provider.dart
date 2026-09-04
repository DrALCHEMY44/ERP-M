import 'package:flutter/foundation.dart';

import '../models/expense.dart';
import '../models/inventory_item.dart';
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

  void reset() {
    _sales.clear();
    _expenses.clear();
    _isLoading = false;
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
      _sales.clear();
      _expenses.clear();
      if (AuthService.hasPermission('viewSales')) {
        final response = await ApiService.request(
          '/api/sales',
          retryTransient: true,
        );
        final salesRows = response['sales'] as List<dynamic>? ?? [];
        for (final value in salesRows) {
          final row = value as Map<String, dynamic>;
          final lines = row['productsSold'] as List<dynamic>? ?? [];
          final saleLines = lines
              .map((value) {
                final item = value as Map<String, dynamic>;
                return SaleLine(
                  productId: item['productId']?.toString() ?? '',
                  productName: item['productName']?.toString() ?? 'Product',
                  quantity: (item['quantity'] as num?)?.toInt() ?? 0,
                  priceAtSale: (item['priceAtSale'] as num?)?.toDouble() ?? 0,
                  unitId: item['unitId']?.toString(),
                  unitName: item['unitName']?.toString(),
                  conversionFactor:
                      (item['conversionFactor'] as num?)?.toInt() ?? 1,
                );
              })
              .toList(growable: false);
          final names = lines
              .map((line) {
                final item = line as Map<String, dynamic>;
                final name = item['productName'] as String?;
                final unitName = item['unitName'] as String?;
                final lineQuantity = (item['quantity'] as num?)?.toInt();
                if (name == null) return null;
                return unitName == null
                    ? name
                    : '$name ($lineQuantity $unitName)';
              })
              .whereType<String>()
              .join(', ');
          final quantity = lines.fold<int>(
            0,
            (sum, line) =>
                sum +
                ((line as Map<String, dynamic>)['quantity'] as num).toInt(),
          );
          _sales.add(
            Sale(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              itemName: names.isEmpty ? 'Sale' : names,
              quantity: quantity,
              totalAmount: (row['totalAmount'] as num).toDouble(),
              date: DateTime.parse(row['saleDate'] as String),
              recordedBy: row['recordedBy'] as String,
              paymentMethod: row['paymentMethod']?.toString() ?? 'Cash',
              customerId: row['customerId']?.toString(),
              items: saleLines,
            ),
          );
        }
      }
      if (AuthService.hasPermission('viewExpenses')) {
        final response = await ApiService.request(
          '/api/data',
          method: 'POST',
          body: {
            'operation': 'listTransactionsByType',
            'variables': {'type': 'EXPENSE'},
          },
          retryTransient: true,
        );
        final expenseData = response['data'] as Map<String, dynamic>;
        final expenseRows = expenseData['transactions'] as List<dynamic>? ?? [];
        for (final value in expenseRows) {
          final row = value as Map<String, dynamic>;
          _expenses.add(
            Expense(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              category: row['category'] as String? ?? 'Other',
              description:
                  row['description'] as String? ?? 'Operational expense',
              amount: (row['amount'] as num).toDouble(),
              date: DateTime.parse(row['date'] as String),
              recordedBy: row['recordedBy'] as String,
              receiptUrl: row['receiptUrl']?.toString(),
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
    InventoryProvider inventory, {
    ProductUnit? unit,
  }) async {
    return recordSaleItems(
      [
        {
          'productId': productId,
          'quantity': quantity,
          if (unit != null) 'unitId': unit.id,
        },
      ],
      core,
      inventory,
    );
  }

  Future<bool> recordSaleItems(
    List<Map<String, dynamic>> items,
    CoreProvider core,
    InventoryProvider inventory, {
    String paymentMethod = 'CASH',
    String? customerId,
  }) async {
    if (!AuthService.hasPermission('manageSales')) return false;
    if (items.isEmpty) throw const ApiException('Add at least one product.');
    setLoading(true);
    try {
      await ApiService.request(
        '/api/sales',
        method: 'POST',
        body: {
          'idempotencyKey':
              '${AuthService.currentUser!.id}-${DateTime.now().microsecondsSinceEpoch}',
          'paymentMethod': paymentMethod,
          if (customerId != null && customerId.isNotEmpty)
            'customerId': customerId,
          'items': items,
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
    CoreProvider core, {
    DateTime? date,
    String? receiptUrl,
  }) async {
    if (!AuthService.hasPermission('manageExpenses')) return false;
    setLoading(true);
    try {
      await _dataOperation('CreateTransaction', {
        'type': 'EXPENSE',
        'amount': amount,
        'date': (date ?? DateTime.now()).toUtc().toIso8601String(),
        'category': category,
        'description': description,
        'receiptUrl': receiptUrl,
      });
      await loadData();
      return true;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> deleteExpense(String expenseId) async {
    if (!AuthService.hasPermission('manageExpenses')) return false;
    await _dataOperation('DeleteTransaction', {'id': expenseId});
    await loadData();
    return true;
  }
}
