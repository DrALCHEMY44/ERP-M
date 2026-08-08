part of 'example.dart';

class CreateActivityLogVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;
  String userName;
  String actionType;
  String module;
  Optional<String> _description = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _recordId = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateActivityLogVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  CreateActivityLogVariablesBuilder recordId(String? t) {
   _recordId.value = t;
   return this;
  }

  CreateActivityLogVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.userId,required  this.userName,required  this.actionType,required  this.module,});
  Deserializer<CreateActivityLogData> dataDeserializer = (dynamic json)  => CreateActivityLogData.fromJson(jsonDecode(json));
  Serializer<CreateActivityLogVariables> varsSerializer = (CreateActivityLogVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateActivityLogData, CreateActivityLogVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateActivityLogData, CreateActivityLogVariables> ref() {
    CreateActivityLogVariables vars= CreateActivityLogVariables(tenantId: tenantId,businessId: businessId,userId: userId,userName: userName,actionType: actionType,module: module,description: _description,recordId: _recordId,);
    return _dataConnect.mutation("CreateActivityLog", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateActivityLogActivityLogInsert {
  final String id;
  CreateActivityLogActivityLogInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateActivityLogActivityLogInsert otherTyped = other as CreateActivityLogActivityLogInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateActivityLogActivityLogInsert({
    required this.id,
  });
}

@immutable
class CreateActivityLogData {
  final CreateActivityLogActivityLogInsert activityLog_insert;
  CreateActivityLogData.fromJson(dynamic json):
  
  activityLog_insert = CreateActivityLogActivityLogInsert.fromJson(json['activityLog_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateActivityLogData otherTyped = other as CreateActivityLogData;
    return activityLog_insert == otherTyped.activityLog_insert;
    
  }
  @override
  int get hashCode => activityLog_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['activityLog_insert'] = activityLog_insert.toJson();
    return json;
  }

  CreateActivityLogData({
    required this.activityLog_insert,
  });
}

@immutable
class CreateActivityLogVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  final String userName;
  final String actionType;
  final String module;
  late final Optional<String>description;
  late final Optional<String>recordId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateActivityLogVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']),
  userName = nativeFromJson<String>(json['userName']),
  actionType = nativeFromJson<String>(json['actionType']),
  module = nativeFromJson<String>(json['module']) {
  
  
  
  
  
  
  
  
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

    final CreateActivityLogVariables otherTyped = other as CreateActivityLogVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    userName == otherTyped.userName && 
    actionType == otherTyped.actionType && 
    module == otherTyped.module && 
    description == otherTyped.description && 
    recordId == otherTyped.recordId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, userId.hashCode, userName.hashCode, actionType.hashCode, module.hashCode, description.hashCode, recordId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['userName'] = nativeToJson<String>(userName);
    json['actionType'] = nativeToJson<String>(actionType);
    json['module'] = nativeToJson<String>(module);
    if(description.state == OptionalState.set) {
      json['description'] = description.toJson();
    }
    if(recordId.state == OptionalState.set) {
      json['recordId'] = recordId.toJson();
    }
    return json;
  }

  CreateActivityLogVariables({
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

