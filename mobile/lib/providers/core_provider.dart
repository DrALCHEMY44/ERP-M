import 'package:flutter/foundation.dart';

import '../models/activity_log.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/announcement_service.dart';

class CoreProvider with ChangeNotifier {
  final List<ActivityLog> _activityLogs = [];
  final List<NotificationModel> _notifications = [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  String get currentTenantId => AuthService.currentUser?.tenantId ?? '';
  String get currentUserId => AuthService.currentUser?.id ?? '';
  String get currentUserName => AuthService.currentUser?.name ?? 'System';
  String get currentUserRole =>
      AuthService.currentUser?.role.displayName ?? 'System';
  List<ActivityLog> get activityLogs => List.unmodifiable(_activityLogs);
  List<NotificationModel> get notifications =>
      List.unmodifiable(_notifications);
  List<NotificationModel> get unreadNotifications =>
      _notifications.where((item) => !item.isRead).toList();

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void reset() {
    _activityLogs.clear();
    _notifications.clear();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadData() async {
    if (AuthService.currentUser == null) {
      reset();
      return;
    }
    setLoading(true);
    try {
      if (AuthService.hasPermission('viewActivityLogs')) {
        final result = await ApiService.request(
          '/api/data',
          method: 'POST',
          body: {'operation': 'listActivityLogsByBusiness', 'variables': {}},
          retryTransient: true,
        );
        final rows =
            ((result['data'] as Map<String, dynamic>)['activityLogs']
                as List<dynamic>? ??
            const []);
        _activityLogs
          ..clear()
          ..addAll(
            rows.map((raw) {
              final row = raw as Map<String, dynamic>;
              return ActivityLog(
                id: row['id'].toString(),
                tenantId: row['tenantId']?.toString() ?? '',
                businessId: row['businessId']?.toString() ?? '',
                userId: row['userId']?.toString() ?? '',
                userName: row['userName']?.toString() ?? 'Member',
                userRole: 'Member',
                actionType: row['actionType']?.toString() ?? 'ACTION',
                module: row['module']?.toString() ?? 'System',
                description: row['description']?.toString() ?? '',
                timestamp:
                    DateTime.tryParse(row['timestamp']?.toString() ?? '') ??
                    DateTime.now(),
              );
            }),
          );
      } else {
        _activityLogs.clear();
      }
      final announcements = await AnnouncementService.list();
      _notifications
        ..clear()
        ..addAll(
          announcements.items.map(
            (item) => NotificationModel(
              id: item.id,
              tenantId: currentTenantId,
              businessId: AuthService.currentUser?.businessId ?? '',
              title: item.title,
              message: item.message,
              type: item.priority == 'URGENT'
                  ? NotificationType.error
                  : item.priority == 'IMPORTANT'
                  ? NotificationType.warning
                  : NotificationType.info,
              isRead: item.isRead,
              createdAt: item.createdAt,
            ),
          ),
        );
    } finally {
      setLoading(false);
    }
  }

  Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      final result = await ApiService.request(
        '/api/ai/query',
        method: 'POST',
        body: {'queryText': prompt},
        timeout: const Duration(seconds: 60),
      );
      return result['response'] as String? ??
          'The AI service returned no text.';
    } finally {
      setLoading(false);
    }
  }

  Future<void> logActivity(
    String actionType,
    String module,
    String description,
  ) async {
    await ApiService.request(
      '/api/audit',
      method: 'POST',
      body: {
        'actionType': actionType,
        'module': module,
        'description': description,
      },
    );
    if (AuthService.hasPermission('viewActivityLogs')) await loadData();
  }

  Future<void> triggerNotification(
    String title,
    String message,
    NotificationType type,
  ) async {
    await ApiService.request(
      '/api/notifications',
      method: 'POST',
      body: {
        'title': title,
        'message': message,
        'type': type.name,
        'module': title.toLowerCase().contains('stock') ? 'Inventory' : 'Tasks',
        'link': title.toLowerCase().contains('stock') ? '/inventory' : '/tasks',
      },
    );
    await loadData();
  }

  Future<void> markAllNotificationsAsRead() async {
    await Future.wait(
      _notifications
          .where((item) => !item.isRead)
          .map((item) => AnnouncementService.markRead(item.id)),
    );
    await loadData();
  }
}
