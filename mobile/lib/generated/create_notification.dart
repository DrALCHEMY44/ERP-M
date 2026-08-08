part of 'example.dart';

class CreateNotificationVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;
  String message;
  bool isRead;

  final FirebaseDataConnect _dataConnect;
  CreateNotificationVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.userId,required  this.message,required  this.isRead,});
  Deserializer<CreateNotificationData> dataDeserializer = (dynamic json)  => CreateNotificationData.fromJson(jsonDecode(json));
  Serializer<CreateNotificationVariables> varsSerializer = (CreateNotificationVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateNotificationData, CreateNotificationVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateNotificationData, CreateNotificationVariables> ref() {
    CreateNotificationVariables vars= CreateNotificationVariables(tenantId: tenantId,businessId: businessId,userId: userId,message: message,isRead: isRead,);
    return _dataConnect.mutation("CreateNotification", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateNotificationNotificationInsert {
  final String id;
  CreateNotificationNotificationInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateNotificationNotificationInsert otherTyped = other as CreateNotificationNotificationInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateNotificationNotificationInsert({
    required this.id,
  });
}

@immutable
class CreateNotificationData {
  final CreateNotificationNotificationInsert notification_insert;
  CreateNotificationData.fromJson(dynamic json):
  
  notification_insert = CreateNotificationNotificationInsert.fromJson(json['notification_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateNotificationData otherTyped = other as CreateNotificationData;
    return notification_insert == otherTyped.notification_insert;
    
  }
  @override
  int get hashCode => notification_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['notification_insert'] = notification_insert.toJson();
    return json;
  }

  CreateNotificationData({
    required this.notification_insert,
  });
}

@immutable
class CreateNotificationVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  final String message;
  final bool isRead;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateNotificationVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']),
  message = nativeFromJson<String>(json['message']),
  isRead = nativeFromJson<bool>(json['isRead']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateNotificationVariables otherTyped = other as CreateNotificationVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    message == otherTyped.message && 
    isRead == otherTyped.isRead;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, userId.hashCode, message.hashCode, isRead.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['message'] = nativeToJson<String>(message);
    json['isRead'] = nativeToJson<bool>(isRead);
    return json;
  }

  CreateNotificationVariables({
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.message,
    required this.isRead,
  });
}

