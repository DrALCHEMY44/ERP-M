part of 'example.dart';

class UpdateNotificationVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _userId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _message = Optional.optional(nativeFromJson, nativeToJson);
  Optional<bool> _isRead = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateNotificationVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder message(String? t) {
   _message.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder isRead(bool? t) {
   _isRead.value = t;
   return this;
  }

  UpdateNotificationVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateNotificationData> dataDeserializer = (dynamic json)  => UpdateNotificationData.fromJson(jsonDecode(json));
  Serializer<UpdateNotificationVariables> varsSerializer = (UpdateNotificationVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateNotificationData, UpdateNotificationVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateNotificationData, UpdateNotificationVariables> ref() {
    UpdateNotificationVariables vars= UpdateNotificationVariables(id: id,tenantId: _tenantId,businessId: _businessId,userId: _userId,message: _message,isRead: _isRead,);
    return _dataConnect.mutation("UpdateNotification", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateNotificationNotificationUpdate {
  final String id;
  UpdateNotificationNotificationUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateNotificationNotificationUpdate otherTyped = other as UpdateNotificationNotificationUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateNotificationNotificationUpdate({
    required this.id,
  });
}

@immutable
class UpdateNotificationData {
  final UpdateNotificationNotificationUpdate? notification_update;
  UpdateNotificationData.fromJson(dynamic json):
  
  notification_update = json['notification_update'] == null ? null : UpdateNotificationNotificationUpdate.fromJson(json['notification_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateNotificationData otherTyped = other as UpdateNotificationData;
    return notification_update == otherTyped.notification_update;
    
  }
  @override
  int get hashCode => notification_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (notification_update != null) {
      json['notification_update'] = notification_update!.toJson();
    }
    return json;
  }

  UpdateNotificationData({
    this.notification_update,
  });
}

@immutable
class UpdateNotificationVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>userId;
  late final Optional<String>message;
  late final Optional<bool>isRead;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateNotificationVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    userId = Optional.optional(nativeFromJson, nativeToJson);
    userId.value = json['userId'] == null ? null : nativeFromJson<String>(json['userId']);
  
  
    message = Optional.optional(nativeFromJson, nativeToJson);
    message.value = json['message'] == null ? null : nativeFromJson<String>(json['message']);
  
  
    isRead = Optional.optional(nativeFromJson, nativeToJson);
    isRead.value = json['isRead'] == null ? null : nativeFromJson<bool>(json['isRead']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateNotificationVariables otherTyped = other as UpdateNotificationVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    message == otherTyped.message && 
    isRead == otherTyped.isRead;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, userId.hashCode, message.hashCode, isRead.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(userId.state == OptionalState.set) {
      json['userId'] = userId.toJson();
    }
    if(message.state == OptionalState.set) {
      json['message'] = message.toJson();
    }
    if(isRead.state == OptionalState.set) {
      json['isRead'] = isRead.toJson();
    }
    return json;
  }

  UpdateNotificationVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.message,
    required this.isRead,
  });
}

