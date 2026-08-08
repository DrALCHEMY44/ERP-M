class InventoryItem {
  final String id;
  final String tenantId;
  final String businessId;
  final String name;
  final String category;
  final int stockLevel;
  final String unit;
  final double costPrice;
  final double price;
  final int lowStockLevel;

  InventoryItem({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.name,
    required this.category,
    required this.stockLevel,
    required this.unit,
    required this.costPrice,
    required this.price,
    required this.lowStockLevel,
  });

  InventoryItem copyWith({
    String? id,
    String? tenantId,
    String? businessId,
    String? name,
    String? category,
    int? stockLevel,
    String? unit,
    double? costPrice,
    double? price,
    int? lowStockLevel,
  }) {
    return InventoryItem(
      id: id ?? this.id,
      tenantId: tenantId ?? this.tenantId,
      businessId: businessId ?? this.businessId,
      name: name ?? this.name,
      category: category ?? this.category,
      stockLevel: stockLevel ?? this.stockLevel,
      unit: unit ?? this.unit,
      costPrice: costPrice ?? this.costPrice,
      price: price ?? this.price,
      lowStockLevel: lowStockLevel ?? this.lowStockLevel,
    );
  }

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: json['id'].toString(),
      tenantId: json['tenantId'] ?? '',
      businessId: json['businessId'] ?? '',
      name: json['name'],
      category: json['category'] ?? 'General',
      stockLevel: json['stockLevel'],
      unit: json['unit'] ?? 'Units',
      costPrice: (json['costPrice'] ?? 0.0).toDouble(),
      price: json['price'].toDouble(),
      lowStockLevel: json['lowStockLevel'] ?? 5,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'tenantId': tenantId,
    'businessId': businessId,
    'name': name,
    'category': category,
    'stockLevel': stockLevel,
    'unit': unit,
    'costPrice': costPrice,
    'price': price,
    'lowStockLevel': lowStockLevel,
  };
}
