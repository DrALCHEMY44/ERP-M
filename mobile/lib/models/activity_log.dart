class ActivityLog {
  final String id;
  final String tenantId;
  final String businessId;
  final String userId;
  final String userName;
  final String userRole;
  final String actionType; // e.g., 'LOGIN', 'RECORD_SALE', etc.
  final String module;     // e.g., 'Auth', 'Sales', 'Tasks'
  final String description;
  final DateTime timestamp;

  ActivityLog({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.userName,
    required this.userRole,
    required this.actionType,
    required this.module,
    required this.description,
    required this.timestamp,
  });
}
