part of 'example.dart';

class ListNotificationsVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;

  final FirebaseDataConnect _dataConnect;
  ListNotificationsVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.userId,});
  Deserializer<ListNotificationsData> dataDeserializer = (dynamic json)  => ListNotificationsData.fromJson(jsonDecode(json));
  Serializer<ListNotificationsVariables> varsSerializer = (ListNotificationsVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListNotificationsData, ListNotificationsVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListNotificationsData, ListNotificationsVariables> ref() {
    ListNotificationsVariables vars= ListNotificationsVariables(tenantId: tenantId,businessId: businessId,userId: userId,);
    return _dataConnect.query("listNotifications", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListNotificationsNotifications {
  final String id;
  final String tenantId;
  final String businessId;
  final String userId;
  final String message;
  final bool isRead;
  final Timestamp createdAt;
  ListNotificationsNotifications.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']),
  message = nativeFromJson<String>(json['message']),
  isRead = nativeFromJson<bool>(json['isRead']),
  createdAt = Timestamp.fromJson(json['createdAt']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListNotificationsNotifications otherTyped = other as ListNotificationsNotifications;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    message == otherTyped.message && 
    isRead == otherTyped.isRead && 
    createdAt == otherTyped.createdAt;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, userId.hashCode, message.hashCode, isRead.hashCode, createdAt.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['message'] = nativeToJson<String>(message);
    json['isRead'] = nativeToJson<bool>(isRead);
    json['createdAt'] = createdAt.toJson();
    return json;
  }

  ListNotificationsNotifications({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.message,
    required this.isRead,
    required this.createdAt,
  });
}

@immutable
class ListNotificationsData {
  final List<ListNotificationsNotifications> notifications;
  ListNotificationsData.fromJson(dynamic json):
  
  notifications = (json['notifications'] as List<dynamic>)
        .map((e) => ListNotificationsNotifications.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListNotificationsData otherTyped = other as ListNotificationsData;
    return notifications == otherTyped.notifications;
    
  }
  @override
  int get hashCode => notifications.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['notifications'] = notifications.map((e) => e.toJson()).toList();
    return json;
  }

  ListNotificationsData({
    required this.notifications,
  });
}

@immutable
class ListNotificationsVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListNotificationsVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListNotificationsVariables otherTyped = other as ListNotificationsVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, userId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    return json;
  }

  ListNotificationsVariables({
    required this.tenantId,
    required this.businessId,
    required this.userId,
  });
}

