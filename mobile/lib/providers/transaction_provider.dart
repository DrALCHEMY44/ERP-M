import 'package:flutter/material.dart';
import '../models/sale.dart';
import '../models/expense.dart';
import '../services/auth_service.dart';
import '../services/neon_mirror_service.dart';
import '../generated/example.dart' as dc;
import 'core_provider.dart';
import 'inventory_provider.dart';
// Note: dc.Timestamp is required if they use custom Timestamp, wait, Timestamp is from firebase_data_connect?
import 'package:firebase_data_connect/firebase_data_connect.dart';

class TransactionProvider with ChangeNotifier {
  final List<Sale> _sales = [];
  final List<Expense> _expenses = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  String get _currentTenantId => AuthService.currentUser?.tenantId ?? '';

  List<Sale> get sales => _sales.where((s) => s.tenantId == _currentTenantId).toList();
  List<Expense> get expenses => _expenses.where((e) => e.tenantId == _currentTenantId).toList();

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  Future<void> loadData() async {
    if (AuthService.currentUser == null) return;
    setLoading(true);

    try {
      final tenantId = _currentTenantId;
      final businessId = AuthService.currentUser?.businessId ?? 'biz_general';

      final txResult = await dc.ExampleConnector.instance.listTransactionsByBusiness(
        tenantId: tenantId,
        businessId: businessId,
      ).execute();

      _sales.clear();
      _expenses.clear();
      for (var tx in txResult.data.transactions) {
        if (tx.type is dc.Known && (tx.type as dc.Known<dc.TransactionType>).value == dc.TransactionType.SALE) {
          _sales.add(Sale(
            id: tx.id,
            tenantId: tx.tenantId,
            businessId: tx.businessId,
            itemName: tx.category ?? 'Item',
            quantity: 1, // Quantity might not be strictly preserved in tx model based on old ErpProvider logic
            totalAmount: tx.amount,
            date: tx.date.toDateTime(),
            recordedBy: tx.recordedBy,
          ));
        } else if (tx.type is dc.Known && (tx.type as dc.Known<dc.TransactionType>).value == dc.TransactionType.EXPENSE) {
          _expenses.add(Expense(
            id: tx.id,
            tenantId: tx.tenantId,
            businessId: tx.businessId,
            category: tx.category ?? 'Other',
            description: 'Operational expense',
            amount: tx.amount,
            date: tx.date.toDateTime(),
            recordedBy: tx.recordedBy,
          ));
        }
      }
    } catch (e) {
      print('Transaction load error: $e');
    } finally {
      setLoading(false);
    }
  }

  Future<bool> recordSale(String productId, int quantity, CoreProvider core, InventoryProvider inventory) async {
    setLoading(true);

    try {
      if (!AuthService.hasPermission('manageSales')) {
        await core.logActivity('FAILED_SALE', 'Sales', 'Unauthorized attempt to record sale.');
        return false;
      }
      
      final product = inventory.getProduct(productId);
      if (product == null) return false;

      // Decrease stock in inventory
      bool stockDecreased = await inventory.decreaseStock(productId, quantity, core);
      if (!stockDecreased) return false;

      final double totalAmount = product.price * quantity;

      // Log sale transaction in DB
      final transactionResult = await dc.ExampleConnector.instance.createTransaction(
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        type: dc.TransactionType.SALE,
        amount: totalAmount,
        date: Timestamp.fromJson(DateTime.now().toUtc().toIso8601String()),
        recordedBy: core.currentUserName,
      ).category(product.name).execute();
      await NeonMirrorService.mirror(
        entity: 'transaction',
        operation: 'upsert',
        recordId: transactionResult.data.transaction_insert.id,
        payload: {
          'type': 'SALE',
          'amount': totalAmount,
          'category': product.name,
          'recordedBy': core.currentUserName,
          'date': DateTime.now().toUtc().toIso8601String(),
        },
      );

      // Append local sale cache
      _sales.insert(0, Sale(
        id: 'SALE-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        itemName: product.name,
        quantity: quantity,
        totalAmount: totalAmount,
        date: DateTime.now(),
        recordedBy: core.currentUserName,
      ));

      await core.logActivity('RECORD_SALE', 'Sales', 'Recorded sale of $quantity ${product.name} (FCFA ${totalAmount.toInt()})');

      return true;
    } catch (e) {
      print('Record sale error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> recordExpense(String category, String description, double amount, CoreProvider core) async {
    setLoading(true);

    try {
      if (!AuthService.hasPermission('manageExpenses')) {
        await core.logActivity('FAILED_EXPENSE', 'Expenses', 'Unauthorized attempt to record expense.');
        return false;
      }

      // Create transaction in DB
      final transactionResult = await dc.ExampleConnector.instance.createTransaction(
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        type: dc.TransactionType.EXPENSE,
        amount: amount,
        date: Timestamp.fromJson(DateTime.now().toUtc().toIso8601String()),
        recordedBy: core.currentUserName,
      ).category(category).execute();
      await NeonMirrorService.mirror(
        entity: 'transaction',
        operation: 'upsert',
        recordId: transactionResult.data.transaction_insert.id,
        payload: {
          'type': 'EXPENSE',
          'amount': amount,
          'category': category,
          'description': description,
          'recordedBy': core.currentUserName,
          'date': DateTime.now().toUtc().toIso8601String(),
        },
      );

      _expenses.insert(0, Expense(
        id: 'EXP-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        category: category,
        description: description,
        amount: amount,
        date: DateTime.now(),
        recordedBy: core.currentUserName,
      ));

      await core.logActivity('RECORD_EXPENSE', 'Expenses', 'Recorded expense for $category: $description (FCFA ${amount.toInt()})');
      return true;
    } catch (e) {
      print('Record expense error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }
}
