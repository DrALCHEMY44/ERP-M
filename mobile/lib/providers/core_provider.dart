import 'package:flutter/material.dart';
import '../models/activity_log.dart';
import '../models/notification_model.dart';
import '../services/auth_service.dart';
import '../generated/example.dart' as dc;

class CoreProvider with ChangeNotifier {
  final List<ActivityLog> _activityLogs = [];
  final List<NotificationModel> _notifications = [];
  
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  String get currentTenantId => AuthService.currentUser?.tenantId ?? '';
  String get currentUserId => AuthService.currentUser?.id ?? '';
  String get currentUserName => AuthService.currentUser?.name ?? 'System';
  String get currentUserRole => AuthService.currentUser?.role.displayName ?? 'System';

  List<ActivityLog> get activityLogs => _activityLogs.where((a) => a.tenantId == currentTenantId).toList();
  List<NotificationModel> get notifications => _notifications.where((n) => n.tenantId == currentTenantId).toList();
  List<NotificationModel> get unreadNotifications => notifications.where((n) => !n.isRead).toList();

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

  Future<void> seedNewTenant(String tenantId, String businessName, String industry) async {
    setLoading(true);
    try {
      await logActivity('TENANT_CREATED', 'System', 'New tenant $tenantId registered for $businessName ($industry).');
      // Any additional initial seeding like creating default categories or settings could go here.
    } catch (e) {
      print('Seed error: $e');
    } finally {
      setLoading(false);
      Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

  Future<void> loadData() async {
    if (AuthService.currentUser == null) return;
    setLoading(true);

    try {
      final tenantId = currentTenantId;
      final businessId = AuthService.currentUser?.businessId ?? 'biz_general';
      final userId = currentUserId;

      // Fetch Activity Logs
      final logsResult = await dc.ExampleConnector.instance.listActivityLogsByBusiness(
        tenantId: tenantId,
        businessId: businessId,
      ).execute();

      _activityLogs.clear();
      for (var l in logsResult.data.activityLogs) {
        _activityLogs.add(ActivityLog(
          id: l.id,
          tenantId: l.tenantId,
          businessId: l.businessId,
          userId: l.userId,
          userName: l.userName,
          userRole: 'Staff',
          actionType: l.actionType,
          module: l.module,
          description: l.description ?? '',
          timestamp: l.timestamp.toDateTime(),
        ));
        Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

      // Fetch Notifications
      final notifResult = await dc.ExampleConnector.instance.listNotifications(
        tenantId: tenantId,
        businessId: businessId,
        userId: userId,
      ).execute();

      _notifications.clear();
      for (var n in notifResult.data.notifications) {
        _notifications.add(NotificationModel(
          id: n.id,
          tenantId: n.tenantId,
          businessId: n.businessId,
          title: 'System Alert',
          message: n.message,
          type: NotificationType.info,
          isRead: n.isRead,
          createdAt: n.createdAt.toDateTime(),
        ));
        Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    } catch (e) {
      print('Core data load error: $e');
    } finally {
      setLoading(false);
      Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

  Future<void> logActivity(String actionType, String module, String description) async {
    try {
      await dc.ExampleConnector.instance.createActivityLog(
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        userId: currentUserId,
        userName: currentUserName,
        actionType: actionType,
        module: module,
      ).description(description).execute();

      _activityLogs.insert(0, ActivityLog(
        id: 'log_${DateTime.now().millisecondsSinceEpoch}',
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        userId: currentUserId,
        userName: currentUserName,
        userRole: currentUserRole,
        actionType: actionType,
        module: module,
        description: description,
        timestamp: DateTime.now(),
      ));
      notifyListeners();
    } catch (e) {
      print('Log activity error: $e');
      Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

  Future<void> triggerNotification(String title, String message, NotificationType type) async {
    try {
      await dc.ExampleConnector.instance.createNotification(
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        userId: currentUserId,
        message: '$title: $message',
        isRead: false,
      ).execute();

      _notifications.insert(0, NotificationModel(
        id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
        tenantId: currentTenantId,
        businessId: AuthService.currentUser?.businessId ?? 'biz_general',
        title: title,
        message: message,
        type: type,
        createdAt: DateTime.now(),
      ));
      notifyListeners();
    } catch (e) {
      print('Trigger notification error: $e');
      Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}

  Future<void> markAllNotificationsAsRead() async {
    try {
      for (int i = 0; i < _notifications.length; i++) {
        if (_notifications[i].tenantId == currentTenantId && !_notifications[i].isRead) {
          await dc.ExampleConnector.instance.updateNotification(
            id: _notifications[i].id,
          ).isRead(true).execute();
          _notifications[i] = _notifications[i].copyWith(isRead: true);
          Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
        Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
      await logActivity('READ_NOTIFICATIONS', 'Notifications', 'Marked all notifications as read.');
      notifyListeners();
    } catch (e) {
      print('Mark read error: $e');
      Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
    Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
  Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
