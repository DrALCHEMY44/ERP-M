part of 'example.dart';

class CreateTaskCommentVariablesBuilder {
  String tenantId;
  String businessId;
  String taskId;
  String userId;
  String content;

  final FirebaseDataConnect _dataConnect;
  CreateTaskCommentVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.taskId,required  this.userId,required  this.content,});
  Deserializer<CreateTaskCommentData> dataDeserializer = (dynamic json)  => CreateTaskCommentData.fromJson(jsonDecode(json));
  Serializer<CreateTaskCommentVariables> varsSerializer = (CreateTaskCommentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateTaskCommentData, CreateTaskCommentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateTaskCommentData, CreateTaskCommentVariables> ref() {
    CreateTaskCommentVariables vars= CreateTaskCommentVariables(tenantId: tenantId,businessId: businessId,taskId: taskId,userId: userId,content: content,);
    return _dataConnect.mutation("CreateTaskComment", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateTaskCommentTaskCommentInsert {
  final String id;
  CreateTaskCommentTaskCommentInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTaskCommentTaskCommentInsert otherTyped = other as CreateTaskCommentTaskCommentInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateTaskCommentTaskCommentInsert({
    required this.id,
  });
}

@immutable
class CreateTaskCommentData {
  final CreateTaskCommentTaskCommentInsert taskComment_insert;
  CreateTaskCommentData.fromJson(dynamic json):
  
  taskComment_insert = CreateTaskCommentTaskCommentInsert.fromJson(json['taskComment_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTaskCommentData otherTyped = other as CreateTaskCommentData;
    return taskComment_insert == otherTyped.taskComment_insert;
    
  }
  @override
  int get hashCode => taskComment_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['taskComment_insert'] = taskComment_insert.toJson();
    return json;
  }

  CreateTaskCommentData({
    required this.taskComment_insert,
  });
}

@immutable
class CreateTaskCommentVariables {
  final String tenantId;
  final String businessId;
  final String taskId;
  final String userId;
  final String content;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateTaskCommentVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  taskId = nativeFromJson<String>(json['taskId']),
  userId = nativeFromJson<String>(json['userId']),
  content = nativeFromJson<String>(json['content']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTaskCommentVariables otherTyped = other as CreateTaskCommentVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    taskId == otherTyped.taskId && 
    userId == otherTyped.userId && 
    content == otherTyped.content;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, taskId.hashCode, userId.hashCode, content.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['taskId'] = nativeToJson<String>(taskId);
    json['userId'] = nativeToJson<String>(userId);
    json['content'] = nativeToJson<String>(content);
    return json;
  }

  CreateTaskCommentVariables({
    required this.tenantId,
    required this.businessId,
    required this.taskId,
    required this.userId,
    required this.content,
  });
}

