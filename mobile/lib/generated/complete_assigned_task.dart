part of 'example.dart';

class CompleteAssignedTaskVariablesBuilder {
  String taskId;
  String userId;
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  CompleteAssignedTaskVariablesBuilder(
    this._dataConnect, {
    required this.taskId,
    required this.userId,
    required this.tenantId,
    required this.businessId,
  });
  Deserializer<CompleteAssignedTaskData> dataDeserializer = (dynamic json) =>
      CompleteAssignedTaskData.fromJson(jsonDecode(json));
  Serializer<CompleteAssignedTaskVariables> varsSerializer =
      (CompleteAssignedTaskVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<CompleteAssignedTaskData, CompleteAssignedTaskVariables>
  >
  execute() {
    return ref().execute();
  }

  MutationRef<CompleteAssignedTaskData, CompleteAssignedTaskVariables> ref() {
    CompleteAssignedTaskVariables vars = CompleteAssignedTaskVariables(
      taskId: taskId,
      userId: userId,
      tenantId: tenantId,
      businessId: businessId,
    );
    return _dataConnect.mutation(
      "CompleteAssignedTask",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class CompleteAssignedTaskTaskUpdate {
  final String id;
  CompleteAssignedTaskTaskUpdate.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskTaskUpdate otherTyped =
        other as CompleteAssignedTaskTaskUpdate;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CompleteAssignedTaskTaskUpdate({required this.id});
}

@immutable
class CompleteAssignedTaskData {
  final CompleteAssignedTaskTaskUpdate? task_update;
  CompleteAssignedTaskData.fromJson(dynamic json)
    : task_update = json['task_update'] == null
          ? null
          : CompleteAssignedTaskTaskUpdate.fromJson(json['task_update']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskData otherTyped =
        other as CompleteAssignedTaskData;
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

  CompleteAssignedTaskData({this.task_update});
}

@immutable
class CompleteAssignedTaskVariables {
  final String taskId;
  final String userId;
  final String tenantId;
  final String businessId;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  CompleteAssignedTaskVariables.fromJson(Map<String, dynamic> json)
    : taskId = nativeFromJson<String>(json['taskId']),
      userId = nativeFromJson<String>(json['userId']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CompleteAssignedTaskVariables otherTyped =
        other as CompleteAssignedTaskVariables;
    return taskId == otherTyped.taskId &&
        userId == otherTyped.userId &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId;
  }

  @override
  int get hashCode => Object.hashAll([
    taskId.hashCode,
    userId.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['taskId'] = nativeToJson<String>(taskId);
    json['userId'] = nativeToJson<String>(userId);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  CompleteAssignedTaskVariables({
    required this.taskId,
    required this.userId,
    required this.tenantId,
    required this.businessId,
  });
}
