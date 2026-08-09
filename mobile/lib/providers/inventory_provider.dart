import 'package:flutter/foundation.dart';

import '../models/inventory_item.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'core_provider.dart';

class InventoryProvider with ChangeNotifier {
  final List<InventoryItem> _products = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  String get _currentTenantId => AuthService.currentUser?.tenantId ?? '';
  List<InventoryItem> get inventory => List.unmodifiable(_products);

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  Future<Map<String, dynamic>> _operation(
    String operation, [
    Map<String, dynamic> variables = const {},
  ]) async {
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
      final result = await _operation('listProductsByBusiness');
      final data = result['data'] as Map<String, dynamic>;
      final rows = data['products'] as List<dynamic>? ?? [];
      _products
        ..clear()
        ..addAll(
          rows.map((value) {
            final row = value as Map<String, dynamic>;
            return InventoryItem(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              name: row['name'] as String,
              category: row['category'] as String? ?? 'General',
              stockLevel: (row['quantity'] as num).toInt(),
              unit: 'Pcs',
              costPrice: (row['costPrice'] as num?)?.toDouble() ?? 0,
              price: (row['sellingPrice'] as num).toDouble(),
              lowStockLevel: (row['lowStockLevel'] as num?)?.toInt() ?? 10,
            );
          }),
        );
    } finally {
      setLoading(false);
    }
  }

  InventoryItem? getProduct(String id) {
    for (final product in _products) {
      if (product.id == id && product.tenantId == _currentTenantId) {
        return product;
      }
    }
    return null;
  }

  Future<bool> addProduct(
    String name,
    String category,
    int stockLevel,
    String unit,
    double costPrice,
    double price,
    int lowStockLevel,
    CoreProvider core,
  ) async {
    if (!AuthService.hasPermission('manageInventory')) return false;
    setLoading(true);
    try {
      await _operation('CreateProduct', {
        'name': name,
        'category': category,
        'quantity': stockLevel,
        'costPrice': costPrice,
        'sellingPrice': price,
        'lowStockLevel': lowStockLevel,
      });
      await loadData();
      if (stockLevel <= lowStockLevel) {
        await core.triggerNotification(
          'Low Stock Warning',
          '$name was added below its stock threshold.',
          NotificationType.warning,
        );
      }
      return true;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> reorderProduct(String productId, CoreProvider core) async {
    final product = getProduct(productId);
    if (product == null || !AuthService.hasPermission('manageInventory')) {
      return false;
    }
    await _operation('UpdateProduct', {
      'id': productId,
      'quantity': product.stockLevel + 50,
    });
    await loadData();
    return true;
  }

  Future<bool> decreaseStock(
    String productId,
    int quantity,
    CoreProvider core,
  ) async {
    // Stock consumed by a sale must only change inside /api/sales.
    return false;
  }
}
