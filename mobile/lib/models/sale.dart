class Sale {
  final String id;
  final String tenantId;
  final String businessId;
  final String itemName;
  final int quantity;
  final double totalAmount;
  final DateTime date;
  final String recordedBy;
  final String paymentMethod;
  final String? customerId;
  final List<SaleLine> items;

  Sale({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.itemName,
    required this.quantity,
    required this.totalAmount,
    required this.date,
    required this.recordedBy,
    this.paymentMethod = 'Cash',
    this.customerId,
    this.items = const [],
  });
}

class SaleLine {
  final String productId;
  final String productName;
  final int quantity;
  final double priceAtSale;
  final String? unitId;
  final String? unitName;
  final int conversionFactor;

  const SaleLine({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.priceAtSale,
    this.unitId,
    this.unitName,
    this.conversionFactor = 1,
  });
}
