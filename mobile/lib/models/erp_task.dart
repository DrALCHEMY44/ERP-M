enum TaskStatus {
  pending,
  ongoing,
  completed,
  cancelled,
  late,
  overdue;

  String get displayName {
    switch (this) {
      case TaskStatus.pending: return 'Pending';
      case TaskStatus.ongoing: return 'Ongoing';
      case TaskStatus.completed: return 'Completed';
      case TaskStatus.cancelled: return 'Cancelled';
      case TaskStatus.late: return 'Late';
      case TaskStatus.overdue: return 'Overdue';
    }
  }
}

enum TaskPriority {
  low,
  medium,
  high,
  urgent;

  String get displayName {
    switch (this) {
      case TaskPriority.low: return 'Low';
      case TaskPriority.medium: return 'Medium';
      case TaskPriority.high: return 'High';
      case TaskPriority.urgent: return 'Urgent';
    }
  }
}

class ErpTask {
  final String id;
  final String tenantId;
  final String businessId;
  final String title;
  final String description;
  final String assignedToId;
  final String assignedToName;
  final String assignedBy;
  final TaskPriority priority;
  final TaskStatus status;
  final int progress; // 0 - 100
  final DateTime dueDate;

  ErpTask({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.title,
    required this.description,
    required this.assignedToId,
    required this.assignedToName,
    required this.assignedBy,
    required this.priority,
    required this.status,
    required this.progress,
    required this.dueDate,
  });

  bool get isOverdue => dueDate.isBefore(DateTime.now()) && status != TaskStatus.completed;

  ErpTask copyWith({
    String? id,
    String? tenantId,
    String? businessId,
    String? title,
    String? description,
    String? assignedToId,
    String? assignedToName,
    String? assignedBy,
    TaskPriority? priority,
    TaskStatus? status,
    int? progress,
    DateTime? dueDate,
  }) {
    return ErpTask(
      id: id ?? this.id,
      tenantId: tenantId ?? this.tenantId,
      businessId: businessId ?? this.businessId,
      title: title ?? this.title,
      description: description ?? this.description,
      assignedToId: assignedToId ?? this.assignedToId,
      assignedToName: assignedToName ?? this.assignedToName,
      assignedBy: assignedBy ?? this.assignedBy,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      progress: progress ?? this.progress,
      dueDate: dueDate ?? this.dueDate,
    );
  }
}
