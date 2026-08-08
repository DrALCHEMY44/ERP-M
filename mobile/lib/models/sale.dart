class Sale {
  final String id;
  final String tenantId;
  final String businessId;
  final String itemName;
  final int quantity;
  final double totalAmount;
  final DateTime date;
  final String recordedBy;

  Sale({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.itemName,
    required this.quantity,
    required this.totalAmount,
    required this.date,
    required this.recordedBy,
  });
}
