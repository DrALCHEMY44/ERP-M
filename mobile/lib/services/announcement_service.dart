import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

class AnnouncementItem {
  final String id,title,message,priority,createdByName;
  final DateTime createdAt;
  final bool isRead;
  const AnnouncementItem({required this.id,required this.title,required this.message,required this.priority,required this.createdByName,required this.createdAt,required this.isRead});
  factory AnnouncementItem.fromJson(Map<String,dynamic> json)=>AnnouncementItem(id:json['id'],title:json['title'],message:json['message'],priority:json['priority'],createdByName:json['created_by_name'],createdAt:DateTime.parse(json['created_at']),isRead:json['is_read']==true);

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
  static const _base=String.fromEnvironment('API_BASE_URL',defaultValue:'http://10.0.2.2:9002');
  static Future<Map<String,String>> _headers({bool json=false}) async {
    final token=await FirebaseAuth.instance.currentUser?.getIdToken();
    if(token==null) throw Exception('Sign in again to load announcements.');
    return {'Authorization':'Bearer $token',if(json)'Content-Type':'application/json'};
  }
  static Future<({List<AnnouncementItem> items,bool canPublish})> list() async {
    final response=await http.get(Uri.parse('$_base/api/announcements'),headers:await _headers());
    final body=jsonDecode(response.body) as Map<String,dynamic>;
    if(response.statusCode>=400) throw Exception(body['error']??'Could not load announcements');
    return (items:(body['announcements'] as List).map((x)=>AnnouncementItem.fromJson(x)).toList(),canPublish:body['canPublish']==true);
  }
  static Future<void> publish(String title,String message,String priority) async {
    final response=await http.post(Uri.parse('$_base/api/announcements'),headers:await _headers(json:true),body:jsonEncode({'title':title,'message':message,'priority':priority}));
    if(response.statusCode>=400) throw Exception((jsonDecode(response.body) as Map)['error']??'Could not publish');
  }
  static Future<void> markRead(String id) async {await http.patch(Uri.parse('$_base/api/announcements'),headers:await _headers(json:true),body:jsonEncode({'id':id}));}
}
