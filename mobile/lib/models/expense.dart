class Expense {
  final String id;
  final String tenantId;
  final String businessId;
  final String category;
  final String description;
  final double amount;
  final DateTime date;
  final String recordedBy;

  Expense({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.category,
    required this.description,
    required this.amount,
    required this.date,
    required this.recordedBy,
  });
}
