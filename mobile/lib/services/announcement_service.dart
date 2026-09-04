import 'api_service.dart';

class AnnouncementItem {
  final String id, title, message, priority, createdByName;
  final DateTime createdAt;
  final bool isRead;

  const AnnouncementItem({
    required this.id,
    required this.title,
    required this.message,
    required this.priority,
    required this.createdByName,
    required this.createdAt,
    required this.isRead,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) =>
      AnnouncementItem(
        id: json['id'].toString(),
        title: json['title']?.toString() ?? 'Notification',
        message: json['message']?.toString() ?? '',
        priority: json['priority']?.toString() ?? 'NORMAL',
        createdByName: json['created_by_name']?.toString() ?? 'SmartERP',
        createdAt:
            DateTime.tryParse(json['created_at']?.toString() ?? '') ??
            DateTime.now(),
        isRead: json['is_read'] == true,
      );

  AnnouncementItem copyWith({bool? isRead}) => AnnouncementItem(
    id: id,
    title: title,
    message: message,
    priority: priority,
    createdByName: createdByName,
    createdAt: createdAt,
    isRead: isRead ?? this.isRead,
  );
}

class AnnouncementService {
  static Future<({List<AnnouncementItem> items, bool canPublish})>
  list() async {
    final body = await ApiService.request(
      '/api/announcements',
      retryTransient: true,
    );
    return (
      items: (body['announcements'] as List<dynamic>? ?? const [])
          .map(
            (value) => AnnouncementItem.fromJson(value as Map<String, dynamic>),
          )
          .toList(growable: false),
      canPublish: body['canPublish'] == true,
    );
  }

  static Future<void> publish(
    String title,
    String message,
    String priority,
  ) async {
    await ApiService.request(
      '/api/announcements',
      method: 'POST',
      body: {'title': title, 'message': message, 'priority': priority},
    );
  }

  static Future<void> markRead(String id) async {
    await ApiService.request(
      '/api/announcements',
      method: 'PATCH',
      body: {'id': id},
    );
  }
}
