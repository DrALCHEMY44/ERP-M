part of 'example.dart';

class UpdateTaskCommentVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _taskId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _userId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _content = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateTaskCommentVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder taskId(String? t) {
   _taskId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder content(String? t) {
   _content.value = t;
   return this;
  }

  UpdateTaskCommentVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateTaskCommentData> dataDeserializer = (dynamic json)  => UpdateTaskCommentData.fromJson(jsonDecode(json));
  Serializer<UpdateTaskCommentVariables> varsSerializer = (UpdateTaskCommentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateTaskCommentData, UpdateTaskCommentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateTaskCommentData, UpdateTaskCommentVariables> ref() {
    UpdateTaskCommentVariables vars= UpdateTaskCommentVariables(id: id,tenantId: _tenantId,businessId: _businessId,taskId: _taskId,userId: _userId,content: _content,);
    return _dataConnect.mutation("UpdateTaskComment", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateTaskCommentTaskCommentUpdate {
  final String id;
  UpdateTaskCommentTaskCommentUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskCommentTaskCommentUpdate otherTyped = other as UpdateTaskCommentTaskCommentUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateTaskCommentTaskCommentUpdate({
    required this.id,
  });
}

@immutable
class UpdateTaskCommentData {
  final UpdateTaskCommentTaskCommentUpdate? taskComment_update;
  UpdateTaskCommentData.fromJson(dynamic json):
  
  taskComment_update = json['taskComment_update'] == null ? null : UpdateTaskCommentTaskCommentUpdate.fromJson(json['taskComment_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskCommentData otherTyped = other as UpdateTaskCommentData;
    return taskComment_update == otherTyped.taskComment_update;
    
  }
  @override
  int get hashCode => taskComment_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (taskComment_update != null) {
      json['taskComment_update'] = taskComment_update!.toJson();
    }
    return json;
  }

  UpdateTaskCommentData({
    this.taskComment_update,
  });
}

@immutable
class UpdateTaskCommentVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>taskId;
  late final Optional<String>userId;
  late final Optional<String>content;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateTaskCommentVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    taskId = Optional.optional(nativeFromJson, nativeToJson);
    taskId.value = json['taskId'] == null ? null : nativeFromJson<String>(json['taskId']);
  
  
    userId = Optional.optional(nativeFromJson, nativeToJson);
    userId.value = json['userId'] == null ? null : nativeFromJson<String>(json['userId']);
  
  
    content = Optional.optional(nativeFromJson, nativeToJson);
    content.value = json['content'] == null ? null : nativeFromJson<String>(json['content']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskCommentVariables otherTyped = other as UpdateTaskCommentVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    taskId == otherTyped.taskId && 
    userId == otherTyped.userId && 
    content == otherTyped.content;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, taskId.hashCode, userId.hashCode, content.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(taskId.state == OptionalState.set) {
      json['taskId'] = taskId.toJson();
    }
    if(userId.state == OptionalState.set) {
      json['userId'] = userId.toJson();
    }
    if(content.state == OptionalState.set) {
      json['content'] = content.toJson();
    }
    return json;
  }

  UpdateTaskCommentVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.taskId,
    required this.userId,
    required this.content,
  });
}

