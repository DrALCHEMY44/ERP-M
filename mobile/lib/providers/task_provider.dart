import 'package:flutter/material.dart';
import '../models/erp_task.dart';
import '../models/notification_model.dart';
import '../services/auth_service.dart';
import '../services/neon_mirror_service.dart';
import '../models/app_user.dart';
import '../generated/example.dart' as dc;
import 'core_provider.dart';
import 'package:firebase_data_connect/firebase_data_connect.dart';

class TaskProvider with ChangeNotifier {
  final List<ErpTask> _tasks = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  String get _currentTenantId => AuthService.currentUser?.tenantId ?? '';

  List<ErpTask> get tasks => _tasks.where((t) => t.tenantId == _currentTenantId).toList();

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

      final Iterable<dynamic> databaseTasks;
      if (AuthService.currentUser?.role == UserRole.staff) {
        final tasksResult = await dc.ExampleConnector.instance.listTasksAssignedToUser(
          tenantId: tenantId,
          businessId: businessId,
          userId: AuthService.currentUser!.id,
        ).execute();
        databaseTasks = tasksResult.data.tasks;
      } else {
        final tasksResult = await dc.ExampleConnector.instance.listTasksByBusiness(
          tenantId: tenantId,
          businessId: businessId,
        ).execute();
        databaseTasks = tasksResult.data.tasks;
      }

      _tasks.clear();
      for (dynamic t in databaseTasks) {
        _tasks.add(ErpTask(
          id: t.id,
          tenantId: t.tenantId,
          businessId: t.businessId,
          title: t.title,
          description: t.description ?? '',
          status: _mapTaskStatus(t.status),
          priority: _mapTaskPriority(t.priority),
          dueDate: t.dueDate.toDateTime(),
          assignedToId: t.assignedTo?.id ?? '',
          assignedToName: t.assignedTo?.email ?? 'Unassigned',
          assignedBy: t.createdBy,
          progress: t.status is dc.Known && (t.status as dc.Known<dc.TaskStatus>).value == dc.TaskStatus.COMPLETED ? 100 : (t.status is dc.Known && (t.status as dc.Known<dc.TaskStatus>).value == dc.TaskStatus.ONGOING ? 50 : 0),
        ));
      }
    } catch (e) {
      print('Tasks load error: $e');
    } finally {
      setLoading(false);
    }
  }

  TaskStatus _mapTaskStatus(dc.EnumValue<dc.TaskStatus>? status) {
    if (status is dc.Known<dc.TaskStatus>) {
      switch (status.value) {
        case dc.TaskStatus.COMPLETED:
          return TaskStatus.completed;
        case dc.TaskStatus.ONGOING:
          return TaskStatus.ongoing;
        case dc.TaskStatus.LATE:
          return TaskStatus.late;
        case dc.TaskStatus.PENDING:
        default:
          return TaskStatus.pending;
      }
    }
    return TaskStatus.pending;
  }

  TaskPriority _mapTaskPriority(dc.EnumValue<dc.TaskPriority>? priority) {
    if (priority is dc.Known<dc.TaskPriority>) {
      switch (priority.value) {
        case dc.TaskPriority.HIGH:
          return TaskPriority.high;
        case dc.TaskPriority.MEDIUM:
          return TaskPriority.medium;
        case dc.TaskPriority.LOW:
        default:
          return TaskPriority.low;
      }
    }
    return TaskPriority.low;
  }

  Future<bool> assignTask(String title, String description, String assignedToId, String assignedToName, TaskPriority priority, DateTime dueDate, CoreProvider core) async {
    setLoading(true);

    try {
      if (!AuthService.hasPermission('manageTasks')) {
        await core.logActivity('FAILED_TASK', 'Tasks', 'Unauthorized attempt to assign task.');
        return false;
      }

      dc.TaskPriority dbPriority;
      switch (priority) {
        case TaskPriority.high:
          dbPriority = dc.TaskPriority.HIGH;
          break;
        case TaskPriority.medium:
          dbPriority = dc.TaskPriority.MEDIUM;
          break;
        case TaskPriority.low:
        default:
          dbPriority = dc.TaskPriority.LOW;
          break;
      }

      final result = await dc.ExampleConnector.instance.createTask(
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        title: title,
        status: dc.TaskStatus.PENDING,
        dueDate: Timestamp.fromJson(dueDate.toUtc().toIso8601String()),
        createdBy: core.currentUserName,
      )
      .description(description)
      .priority(dbPriority)
      .assignedToId(assignedToId.isNotEmpty ? assignedToId : null)
      .execute();

      final newTask = ErpTask(
        id: result.data.task_insert.id,
        tenantId: _currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        title: title,
        description: description,
        assignedToId: assignedToId,
        assignedToName: assignedToName,
        assignedBy: core.currentUserName,
        priority: priority,
        status: TaskStatus.pending,
        progress: 0,
        dueDate: dueDate,
      );

      await NeonMirrorService.mirror(
        entity: 'task',
        operation: 'upsert',
        recordId: newTask.id,
        payload: {
          'title': title,
          'description': description,
          'status': 'PENDING',
          'priority': dbPriority.name,
          'dueDate': dueDate.toUtc().toIso8601String(),
          'assignedToId': assignedToId,
          'createdBy': core.currentUserName,
        },
      );

      _tasks.insert(0, newTask);
      await core.logActivity('ASSIGN_TASK', 'Tasks', 'Assigned task "$title" to $assignedToName');
      
      await core.triggerNotification(
        'New Task Assigned',
        'You have been assigned the task "$title" by ${core.currentUserName}. Due date: ${dueDate.toString().split(' ')[0]}.',
        NotificationType.info,
      );

      return true;
    } catch (e) {
      print('Assign task error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }

  Future<bool> updateTaskProgress(String taskId, int progress, CoreProvider core) async {
    setLoading(true);

    try {
      final taskIndex = _tasks.indexWhere((t) => t.id == taskId && t.tenantId == _currentTenantId);
      if (taskIndex == -1) return false;

      final task = _tasks[taskIndex];

      if (AuthService.currentUser?.role == UserRole.staff && task.assignedToId != core.currentUserId) {
        return false;
      }

      if (AuthService.currentUser?.role != UserRole.staff && !AuthService.hasPermission('manageTasks')) {
        await core.logActivity('FAILED_TASK_UPDATE', 'Tasks', 'Unauthorized role attempted task update.');
        return false;
      }

      TaskStatus status = TaskStatus.ongoing;
      dc.TaskStatus dbStatus = dc.TaskStatus.ONGOING;
      
      if (progress >= 100) {
        status = TaskStatus.completed;
        dbStatus = dc.TaskStatus.COMPLETED;
      } else if (progress == 0) {
        status = TaskStatus.pending;
        dbStatus = dc.TaskStatus.PENDING;
      }

      if (task.dueDate.isBefore(DateTime.now()) && status != TaskStatus.completed) {
        status = TaskStatus.overdue;
        dbStatus = dc.TaskStatus.LATE;
      }

      if (AuthService.currentUser?.role == UserRole.staff) {
        if (progress < 100 || AuthService.currentUser?.accessCode == null) return false;
        await dc.ExampleConnector.instance.completeAssignedTask(
          taskId: taskId,
          userId: core.currentUserId,
          accessCode: AuthService.currentUser!.accessCode!,
        ).execute();
      } else {
        await dc.ExampleConnector.instance.updateTask(
          id: taskId,
        ).status(dbStatus).execute();
      }
      await NeonMirrorService.mirror(
        entity: 'task',
        operation: 'upsert',
        recordId: taskId,
        payload: {'status': dbStatus.name, 'progress': progress},
      );

      _tasks[taskIndex] = task.copyWith(
        progress: progress,
        status: status,
      );

      if (AuthService.currentUser?.role != UserRole.staff) {
        await core.logActivity('UPDATE_TASK', 'Tasks', 'Updated task "${task.title}" progress to $progress% (${status.displayName})');
        if (status == TaskStatus.completed) {
          await core.triggerNotification('Task Completed', 'Task "${task.title}" has been marked completed by ${core.currentUserName}.', NotificationType.success);
        }
      }

      return true;
    } catch (e) {
      print('Update task error: $e');
      return false;
    } finally {
      setLoading(false);
    }
  }
}
