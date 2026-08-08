part of 'example.dart';

class UpdateActivityLogVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _userId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _userName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _actionType = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _module = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _description = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _recordId = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateActivityLogVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder userName(String? t) {
   _userName.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder actionType(String? t) {
   _actionType.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder module(String? t) {
   _module.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder recordId(String? t) {
   _recordId.value = t;
   return this;
  }

  UpdateActivityLogVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateActivityLogData> dataDeserializer = (dynamic json)  => UpdateActivityLogData.fromJson(jsonDecode(json));
  Serializer<UpdateActivityLogVariables> varsSerializer = (UpdateActivityLogVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateActivityLogData, UpdateActivityLogVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateActivityLogData, UpdateActivityLogVariables> ref() {
    UpdateActivityLogVariables vars= UpdateActivityLogVariables(id: id,tenantId: _tenantId,businessId: _businessId,userId: _userId,userName: _userName,actionType: _actionType,module: _module,description: _description,recordId: _recordId,);
    return _dataConnect.mutation("UpdateActivityLog", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateActivityLogActivityLogUpdate {
  final String id;
  UpdateActivityLogActivityLogUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateActivityLogActivityLogUpdate otherTyped = other as UpdateActivityLogActivityLogUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateActivityLogActivityLogUpdate({
    required this.id,
  });
}

@immutable
class UpdateActivityLogData {
  final UpdateActivityLogActivityLogUpdate? activityLog_update;
  UpdateActivityLogData.fromJson(dynamic json):
  
  activityLog_update = json['activityLog_update'] == null ? null : UpdateActivityLogActivityLogUpdate.fromJson(json['activityLog_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateActivityLogData otherTyped = other as UpdateActivityLogData;
    return activityLog_update == otherTyped.activityLog_update;
    
  }
  @override
  int get hashCode => activityLog_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (activityLog_update != null) {
      json['activityLog_update'] = activityLog_update!.toJson();
    }
    return json;
  }

  UpdateActivityLogData({
    this.activityLog_update,
  });
}

@immutable
class UpdateActivityLogVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>userId;
  late final Optional<String>userName;
  late final Optional<String>actionType;
  late final Optional<String>module;
  late final Optional<String>description;
  late final Optional<String>recordId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateActivityLogVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    userId = Optional.optional(nativeFromJson, nativeToJson);
    userId.value = json['userId'] == null ? null : nativeFromJson<String>(json['userId']);
  
  
    userName = Optional.optional(nativeFromJson, nativeToJson);
    userName.value = json['userName'] == null ? null : nativeFromJson<String>(json['userName']);
  
  
    actionType = Optional.optional(nativeFromJson, nativeToJson);
    actionType.value = json['actionType'] == null ? null : nativeFromJson<String>(json['actionType']);
  
  
    module = Optional.optional(nativeFromJson, nativeToJson);
    module.value = json['module'] == null ? null : nativeFromJson<String>(json['module']);
  
  
    description = Optional.optional(nativeFromJson, nativeToJson);
    description.value = json['description'] == null ? null : nativeFromJson<String>(json['description']);
  
  
    recordId = Optional.optional(nativeFromJson, nativeToJson);
    recordId.value = json['recordId'] == null ? null : nativeFromJson<String>(json['recordId']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateActivityLogVariables otherTyped = other as UpdateActivityLogVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    userName == otherTyped.userName && 
    actionType == otherTyped.actionType && 
    module == otherTyped.module && 
    description == otherTyped.description && 
    recordId == otherTyped.recordId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, userId.hashCode, userName.hashCode, actionType.hashCode, module.hashCode, description.hashCode, recordId.hashCode]);
  

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
    if(userName.state == OptionalState.set) {
      json['userName'] = userName.toJson();
    }
    if(actionType.state == OptionalState.set) {
      json['actionType'] = actionType.toJson();
    }
    if(module.state == OptionalState.set) {
      json['module'] = module.toJson();
    }
    if(description.state == OptionalState.set) {
      json['description'] = description.toJson();
    }
    if(recordId.state == OptionalState.set) {
      json['recordId'] = recordId.toJson();
    }
    return json;
  }

  UpdateActivityLogVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.userName,
    required this.actionType,
    required this.module,
    required this.description,
    required this.recordId,
  });
}

