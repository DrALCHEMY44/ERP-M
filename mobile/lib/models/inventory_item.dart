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
  final String? barcode;
  final List<ProductUnit> units;

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
    this.barcode,
    this.units = const [],
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
    String? barcode,
    List<ProductUnit>? units,
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
      barcode: barcode ?? this.barcode,
      units: units ?? this.units,
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
      barcode: json['barcode'] as String?,
      units: (json['units'] as List<dynamic>? ?? const [])
          .map((value) => ProductUnit.fromJson(value as Map<String, dynamic>))
          .toList(),
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
    'barcode': barcode,
    'units': units.map((value) => value.toJson()).toList(),
  };

  ProductUnit get baseUnitDefinition => units.firstWhere(
    (value) => value.isBase,
    orElse: () => ProductUnit(
      id: '$id:base',
      productId: id,
      unitName: unit,
      abbreviation: unit,
      conversionFactor: 1,
      isBase: true,
    ),
  );
}

class ProductUnit {
  final String id;
  final String productId;
  final String unitName;
  final String abbreviation;
  final int conversionFactor;
  final String? barcode;
  final double? sellingPrice;
  final bool isBase;

  const ProductUnit({
    required this.id,
    required this.productId,
    required this.unitName,
    required this.abbreviation,
    required this.conversionFactor,
    this.barcode,
    this.sellingPrice,
    required this.isBase,
  });

  factory ProductUnit.fromJson(Map<String, dynamic> json) => ProductUnit(
    id: json['id'].toString(),
    productId: json['productId'].toString(),
    unitName: json['unitName'] as String? ?? 'piece',
    abbreviation:
        json['abbreviation'] as String? ??
        json['unitName'] as String? ??
        'piece',
    conversionFactor: (json['conversionFactor'] as num?)?.toInt() ?? 1,
    barcode: json['barcode'] as String?,
    sellingPrice: (json['sellingPrice'] as num?)?.toDouble(),
    isBase: json['isBase'] == true,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'productId': productId,
    'unitName': unitName,
    'abbreviation': abbreviation,
    'conversionFactor': conversionFactor,
    'barcode': barcode,
    'sellingPrice': sellingPrice,
    'isBase': isBase,
  };
}

class BarcodeProductMatch {
  final InventoryItem product;
  final ProductUnit unit;

  const BarcodeProductMatch({required this.product, required this.unit});
}
