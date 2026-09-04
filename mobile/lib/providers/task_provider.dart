import 'package:flutter/foundation.dart';

import '../models/app_user.dart';
import '../models/erp_task.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'core_provider.dart';

class TaskProvider with ChangeNotifier {
  final List<ErpTask> _tasks = [];
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  List<ErpTask> get tasks => List.unmodifiable(_tasks);

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void reset() {
    _tasks.clear();
    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>> _operation(
    String operation, [
    Map<String, dynamic> variables = const {},
  ]) {
    return ApiService.request(
      '/api/data',
      method: 'POST',
      body: {'operation': operation, 'variables': variables},
    );
  }

  Future<void> loadData() async {
    if (AuthService.currentUser == null) return;
    if (!AuthService.hasPermission('viewTasks')) {
      _tasks.clear();
      notifyListeners();
      return;
    }
    setLoading(true);
    try {
      final assignedOnly = AuthService.currentUser?.role == UserRole.staff;
      final response = await ApiService.request(
        '/api/data',
        method: 'POST',
        body: {
          'operation': assignedOnly
              ? 'listTasksAssignedToUser'
              : 'listTasksByBusiness',
          'variables': {},
        },
        retryTransient: true,
      );
      final data = response['data'] as Map<String, dynamic>;
      final rows = data['tasks'] as List<dynamic>? ?? [];
      _tasks
        ..clear()
        ..addAll(
          rows.map((value) {
            final row = value as Map<String, dynamic>;
            final assigned = row['assignedTo'] as Map<String, dynamic>?;
            final status = _status(row['status'] as String?);
            return ErpTask(
              id: row['id'] as String,
              tenantId: row['tenantId'] as String,
              businessId: row['businessId'] as String,
              title: row['title'] as String,
              description: row['description'] as String? ?? '',
              assignedToId: assigned?['id'] as String? ?? '',
              assignedToName:
                  assigned?['fullName'] as String? ??
                  assigned?['email'] as String? ??
                  'Unassigned',
              assignedBy: row['createdBy'] as String,
              priority: _priority(row['priority'] as String?),
              status: status,
              progress: status == TaskStatus.completed
                  ? 100
                  : status == TaskStatus.ongoing
                  ? 50
                  : 0,
              dueDate: DateTime.parse(row['dueDate'] as String),
            );
          }),
        );
    } finally {
      setLoading(false);
    }
  }

  TaskStatus _status(String? value) => switch (value) {
    'COMPLETED' => TaskStatus.completed,
    'ONGOING' => TaskStatus.ongoing,
    'LATE' => TaskStatus.late,
    'CANCELLED' => TaskStatus.cancelled,
    _ => TaskStatus.pending,
  };

  TaskPriority _priority(String? value) => switch (value) {
    'HIGH' => TaskPriority.high,
    'MEDIUM' => TaskPriority.medium,
    _ => TaskPriority.low,
  };

  Future<bool> assignTask(
    String title,
    String description,
    String assignedToId,
    String assignedToName,
    TaskPriority priority,
    DateTime dueDate,
    CoreProvider core,
  ) async {
    if (!AuthService.hasPermission('manageTasks')) return false;
    await _operation('CreateTask', {
      'title': title,
      'description': description,
      'status': 'PENDING',
      'priority': priority == TaskPriority.urgent
          ? 'HIGH'
          : priority.name.toUpperCase(),
      'dueDate': dueDate.toUtc().toIso8601String(),
      'assignedToId': assignedToId.isEmpty ? null : assignedToId,
    });
    await loadData();
    await core.triggerNotification(
      'New Task Assigned',
      '$title was assigned to $assignedToName.',
      NotificationType.info,
    );
    return true;
  }

  Future<bool> deleteTask(String taskId) async {
    if (!AuthService.hasPermission('manageTasks')) return false;
    await _operation('DeleteTask', {'id': taskId});
    await loadData();
    return true;
  }

  Future<bool> updateTask(
    ErpTask task, {
    required String title,
    required String description,
    required TaskPriority priority,
    required DateTime dueDate,
  }) async {
    if (!AuthService.hasPermission('manageTasks')) return false;
    await _operation('UpdateTask', {
      'id': task.id,
      'title': title,
      'description': description,
      'priority': priority == TaskPriority.urgent
          ? 'HIGH'
          : priority.name.toUpperCase(),
      'dueDate': dueDate.toUtc().toIso8601String(),
      'assignedToId': task.assignedToId.isEmpty ? null : task.assignedToId,
    });
    await loadData();
    return true;
  }

  Future<bool> updateTaskStatus(String taskId, TaskStatus status) async {
    if (!AuthService.hasPermission('manageTasks')) return false;
    final value = switch (status) {
      TaskStatus.completed => 'COMPLETED',
      TaskStatus.ongoing => 'ONGOING',
      TaskStatus.late || TaskStatus.overdue => 'LATE',
      TaskStatus.cancelled => 'CANCELLED',
      _ => 'PENDING',
    };
    await _operation('UpdateTask', {'id': taskId, 'status': value});
    await loadData();
    return true;
  }

  Future<bool> updateTaskProgress(
    String taskId,
    int progress,
    CoreProvider core,
  ) async {
    final staff = AuthService.currentUser?.role == UserRole.staff;
    if (staff) {
      if (progress < 100) return false;
      await _operation('CompleteAssignedTask', {'taskId': taskId});
    } else {
      if (!AuthService.hasPermission('manageTasks')) return false;
      final status = progress >= 100
          ? 'COMPLETED'
          : progress == 0
          ? 'PENDING'
          : 'ONGOING';
      await _operation('UpdateTask', {'id': taskId, 'status': status});
    }
    await loadData();
    return true;
  }
}
