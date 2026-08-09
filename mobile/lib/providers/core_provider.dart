import 'package:flutter/foundation.dart';

import '../models/activity_log.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

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

  Future<void> loadData() async {
    // Operational data is loaded by the domain providers through authenticated
    // server endpoints. Local notification state is deliberately non-authoritative.
    notifyListeners();
  }

  Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      final result = await ApiService.request(
        '/api/ai/query',
        method: 'POST',
        body: {'queryText': prompt},
      );
      return result['response'] as String? ??
          'The AI service returned no text.';
    } finally {
      setLoading(false);
    }
  }

  Future<void> seedNewTenant(
    String tenantId,
    String businessName,
    String industry,
  ) async {
    await logActivity(
      'TENANT_CREATED',
      'System',
      'Created $businessName ($industry).',
    );
  }

  Future<void> logActivity(
    String actionType,
    String module,
    String description,
  ) async {
    _activityLogs.insert(
      0,
      ActivityLog(
        id: 'local_${DateTime.now().microsecondsSinceEpoch}',
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? '',
        userId: currentUserId,
        userName: currentUserName,
        userRole: currentUserRole,
        actionType: actionType,
        module: module,
        description: description,
        timestamp: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  Future<void> triggerNotification(
    String title,
    String message,
    NotificationType type,
  ) async {
    _notifications.insert(
      0,
      NotificationModel(
        id: 'local_${DateTime.now().microsecondsSinceEpoch}',
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? '',
        title: title,
        message: message,
        type: type,
        createdAt: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  Future<void> markAllNotificationsAsRead() async {
    for (var index = 0; index < _notifications.length; index++) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
    }
    notifyListeners();
  }
}
