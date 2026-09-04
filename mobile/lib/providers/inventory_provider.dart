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

  void reset() {
    _products.clear();
    _isLoading = false;
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
    if (!AuthService.hasPermission('viewInventory')) {
      _products.clear();
      notifyListeners();
      return;
    }
    setLoading(true);
    try {
      final result = await ApiService.request(
        '/api/data',
        method: 'POST',
        body: {'operation': 'listProductsByBusiness', 'variables': {}},
        retryTransient: true,
      );
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
              unit: row['baseUnit'] as String? ?? 'piece',
              costPrice: (row['costPrice'] as num?)?.toDouble() ?? 0,
              price: (row['sellingPrice'] as num).toDouble(),
              lowStockLevel: (row['lowStockLevel'] as num?)?.toInt() ?? 10,
              barcode: row['barcode'] as String?,
              units: (row['units'] as List<dynamic>? ?? const [])
                  .map(
                    (value) =>
                        ProductUnit.fromJson(value as Map<String, dynamic>),
                  )
                  .toList(),
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
    CoreProvider core, {
    String? barcode,
    String? scanUnit,
    int conversionFactor = 1,
    double? scanSellingPrice,
  }) async {
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
        'baseUnit': unit,
        'scanUnit': scanUnit ?? unit,
        'conversionFactor': conversionFactor,
        'barcode': barcode,
        'scanSellingPrice': scanSellingPrice,
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

  Future<BarcodeProductMatch?> lookupBarcode(String barcode) async {
    final response = await ApiService.request(
      '/api/inventory/barcode',
      method: 'POST',
      body: {'action': 'lookup', 'barcode': barcode.trim()},
    );
    final match = response['match'] as Map<String, dynamic>?;
    if (match == null) return null;
    final productRow = match['product'] as Map<String, dynamic>;
    var product = getProduct(productRow['id'].toString());
    if (product == null) {
      await loadData();
      product = getProduct(productRow['id'].toString());
    }
    if (product == null) return null;
    return BarcodeProductMatch(
      product: product,
      unit: ProductUnit.fromJson(match['unit'] as Map<String, dynamic>),
    );
  }

  Future<int?> receiveByBarcode(String barcode, int packageQuantity) async {
    if (!AuthService.hasPermission('manageInventory')) return null;
    setLoading(true);
    try {
      final response = await ApiService.request(
        '/api/inventory/barcode',
        method: 'POST',
        body: {
          'action': 'receive',
          'barcode': barcode.trim(),
          'quantity': packageQuantity,
        },
      );
      await loadData();
      return (response['baseQuantityAdded'] as num).toInt();
    } finally {
      setLoading(false);
    }
  }

  Future<bool> updateProduct(
    String productId,
    Map<String, dynamic> values,
  ) async {
    if (!AuthService.hasPermission('manageInventory')) return false;
    await _operation('UpdateProduct', {'id': productId, ...values});
    await loadData();
    return true;
  }

  Future<bool> deleteProduct(String productId) async {
    if (!AuthService.hasPermission('manageInventory')) return false;
    await _operation('DeleteProduct', {'id': productId});
    await loadData();
    return true;
  }
}
