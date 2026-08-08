import 'package:flutter/material.dart';
import '../models/inventory_item.dart';
import '../models/notification_model.dart';
import '../services/auth_service.dart';
import '../services/neon_mirror_service.dart';
import '../generated/example.dart' as dc;
import 'core_provider.dart';

class InventoryProvider with ChangeNotifier {
  final List<InventoryItem> _products = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;

  String get _currentTenantId => AuthService.currentUser?.tenantId ?? '';

  List<InventoryItem> get inventory => _products.where((p) => p.tenantId == _currentTenantId).toList();

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

      final productsResult = await dc.ExampleConnector.instance.listProductsByBusiness(
        tenantId: tenantId,
        businessId: businessId,
      ).execute();
      
      _products.clear();
      for (var p in productsResult.data.products) {
        _products.add(InventoryItem(
          id: p.id,
          tenantId: p.tenantId,
          businessId: p.businessId,
          name: p.name,
          category: p.category ?? 'General',
          stockLevel: p.quantity,
          unit: 'Pcs',
          costPrice: p.costPrice ?? 0.0,
          price: p.sellingPrice,
          lowStockLevel: p.lowStockLevel ?? 10,
        ));
      }
    } catch (e) {
      print('Inventory load error: $e');
    } finally {
      setLoading(false);
    }
  }

  InventoryItem? getProduct(String id) {
    try {
      return _products.firstWhere((p) => p.id == id && p.tenantId == _currentTenantId);
    } catch (e) {
      return null;
    }
  }

  Future<bool> addProduct(String name, String category, int stockLevel, String unit, double costPrice, double price, int lowStockLevel, CoreProvider core) async {
    setLoading(true);

    try {
      if (!AuthService.hasPermission('manageInventory')) {
        await core.logActivity('FAILED_INVENTORY', 'Inventory', 'Unauthorized attempt to add inventory.');
        return false;
      }

      final result = await dc.ExampleConnector.instance.createProduct(
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        name: name,
        quantity: stockLevel,
        sellingPrice: price,
        createdBy: core.currentUserName,
      )
      .category(category)
      .costPrice(costPrice)
      .lowStockLevel(lowStockLevel)
      .execute();

      final newProduct = InventoryItem(
        id: result.data.product_insert.id,
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        name: name,
        category: category,
        stockLevel: stockLevel,
        unit: unit,
        costPrice: costPrice,
        price: price,
        lowStockLevel: lowStockLevel,
      );

      await NeonMirrorService.mirror(
        entity: 'product',
        operation: 'upsert',
        recordId: newProduct.id,
        payload: {
          'name': name,
          'category': category,
          'quantity': stockLevel,
          'costPrice': costPrice,
          'sellingPrice': price,
          'lowStockLevel': lowStockLevel,
          'createdBy': core.currentUserName,
        },
      );

      _products.add(newProduct);
      await core.logActivity('ADD_PRODUCT', 'Inventory', 'Added product "$name" to inventory.');

      if (stockLevel <= lowStockLevel) {
        await core.triggerNotification('Low Stock Warning', '$name added with low stock level ($stockLevel $unit remaining).', NotificationType.warning);
      }

      return true;
    } catch (e) {
      print('Add product error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> reorderProduct(String productId, CoreProvider core) async {
    setLoading(true);

    try {
      final productIndex = _products.indexWhere((p) => p.id == productId && p.tenantId == _currentTenantId);
      if (productIndex == -1) return false;

      final product = _products[productIndex];
      final int newQuantity = product.stockLevel + 50;

      await dc.ExampleConnector.instance.updateProduct(
        id: productId,
      ).quantity(newQuantity).execute();
      await NeonMirrorService.mirror(
        entity: 'product',
        operation: 'upsert',
        recordId: productId,
        payload: {'quantity': newQuantity},
      );

      final updatedProduct = product.copyWith(stockLevel: newQuantity);
      _products[productIndex] = updatedProduct;

      await core.logActivity('REORDER_PRODUCT', 'Inventory', 'Ordered 50 units of "${product.name}". Stock updated.');
      await core.triggerNotification('Reorder Success', 'Stock for ${product.name} replenished by 50 units.', NotificationType.success);
      
      return true;
    } catch (e) {
      print('Reorder product error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> decreaseStock(String productId, int quantity, CoreProvider core) async {
    final productIndex = _products.indexWhere((p) => p.id == productId && p.tenantId == _currentTenantId);
    if (productIndex == -1) return false;

    final product = _products[productIndex];
    if (product.stockLevel < quantity) {
      await core.logActivity('FAILED_SALE', 'Sales', 'Failed to sell ${product.name}: Insufficient stock.');
      await core.triggerNotification('Insufficient Stock', 'Cannot complete sale of ${product.name}: requested $quantity, available ${product.stockLevel}.', NotificationType.error);
      return false;
    }

    // Decrement stock in DB
    final int newQuantity = product.stockLevel - quantity;
    await dc.ExampleConnector.instance.updateProduct(
      id: productId,
    ).quantity(newQuantity).execute();
    await NeonMirrorService.mirror(
      entity: 'product',
      operation: 'upsert',
      recordId: productId,
      payload: {'quantity': newQuantity},
    );

    // Update local product cache
    final updatedProduct = product.copyWith(stockLevel: newQuantity);
    _products[productIndex] = updatedProduct;
    
    if (updatedProduct.stockLevel <= updatedProduct.lowStockLevel) {
      await core.triggerNotification(
        'Low Stock Warning',
        '${product.name} is running low on stock! Only ${updatedProduct.stockLevel} ${updatedProduct.unit} left.',
        NotificationType.warning,
      );
    }
    
    notifyListeners();
    return true;
  }
}
