part of 'example.dart';

class CompleteAssignedTaskVariablesBuilder {
  String taskId;
  String userId;
  String accessCode;

  final FirebaseDataConnect _dataConnect;
  CompleteAssignedTaskVariablesBuilder(this._dataConnect, {required  this.taskId,required  this.userId,required  this.accessCode,});
  Deserializer<CompleteAssignedTaskData> dataDeserializer = (dynamic json)  => CompleteAssignedTaskData.fromJson(jsonDecode(json));
  Serializer<CompleteAssignedTaskVariables> varsSerializer = (CompleteAssignedTaskVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CompleteAssignedTaskData, CompleteAssignedTaskVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CompleteAssignedTaskData, CompleteAssignedTaskVariables> ref() {
    CompleteAssignedTaskVariables vars= CompleteAssignedTaskVariables(taskId: taskId,userId: userId,accessCode: accessCode,);
    return _dataConnect.mutation("CompleteAssignedTask", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CompleteAssignedTaskTaskUpdate {
  final String id;
  CompleteAssignedTaskTaskUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskTaskUpdate otherTyped = other as CompleteAssignedTaskTaskUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CompleteAssignedTaskTaskUpdate({
    required this.id,
  });
}

@immutable
class CompleteAssignedTaskData {
  final CompleteAssignedTaskTaskUpdate? task_update;
  CompleteAssignedTaskData.fromJson(dynamic json):
  
  task_update = json['task_update'] == null ? null : CompleteAssignedTaskTaskUpdate.fromJson(json['task_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskData otherTyped = other as CompleteAssignedTaskData;
    return task_update == otherTyped.task_update;
    
  }
  @override
  int get hashCode => task_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (task_update != null) {
      json['task_update'] = task_update!.toJson();
    }
    return json;
  }

  CompleteAssignedTaskData({
    this.task_update,
  });
}

@immutable
class CompleteAssignedTaskVariables {
  final String taskId;
  final String userId;
  final String accessCode;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CompleteAssignedTaskVariables.fromJson(Map<String, dynamic> json):
  
  taskId = nativeFromJson<String>(json['taskId']),
  userId = nativeFromJson<String>(json['userId']),
  accessCode = nativeFromJson<String>(json['accessCode']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskVariables otherTyped = other as CompleteAssignedTaskVariables;
    return taskId == otherTyped.taskId && 
    userId == otherTyped.userId && 
    accessCode == otherTyped.accessCode;
    
  }
  @override
  int get hashCode => Object.hashAll([taskId.hashCode, userId.hashCode, accessCode.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['taskId'] = nativeToJson<String>(taskId);
    json['userId'] = nativeToJson<String>(userId);
    json['accessCode'] = nativeToJson<String>(accessCode);
    return json;
  }

  CompleteAssignedTaskVariables({
    required this.taskId,
    required this.userId,
    required this.accessCode,
  });
}

