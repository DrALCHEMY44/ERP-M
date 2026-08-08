part of 'example.dart';

class UpdateTaskVariablesBuilder {
  String id;
  Optional<String> _title = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _description = Optional.optional(nativeFromJson, nativeToJson);
  Optional<TaskStatus> _status = Optional.optional((data) => TaskStatus.values.byName(data), enumSerializer);
  Optional<TaskPriority> _priority = Optional.optional((data) => TaskPriority.values.byName(data), enumSerializer);
  Optional<Timestamp> _dueDate = Optional.optional((json) => json['dueDate'] = Timestamp.fromJson(json['dueDate']), defaultSerializer);
  Optional<String> _assignedToId = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateTaskVariablesBuilder title(String? t) {
   _title.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder status(TaskStatus? t) {
   _status.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder priority(TaskPriority? t) {
   _priority.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder dueDate(Timestamp? t) {
   _dueDate.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder assignedToId(String? t) {
   _assignedToId.value = t;
   return this;
  }

  UpdateTaskVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateTaskData> dataDeserializer = (dynamic json)  => UpdateTaskData.fromJson(jsonDecode(json));
  Serializer<UpdateTaskVariables> varsSerializer = (UpdateTaskVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateTaskData, UpdateTaskVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateTaskData, UpdateTaskVariables> ref() {
    UpdateTaskVariables vars= UpdateTaskVariables(id: id,title: _title,description: _description,status: _status,priority: _priority,dueDate: _dueDate,assignedToId: _assignedToId,);
    return _dataConnect.mutation("UpdateTask", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateTaskTaskUpdate {
  final String id;
  UpdateTaskTaskUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskTaskUpdate otherTyped = other as UpdateTaskTaskUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateTaskTaskUpdate({
    required this.id,
  });
}

@immutable
class UpdateTaskData {
  final UpdateTaskTaskUpdate? task_update;
  UpdateTaskData.fromJson(dynamic json):
  
  task_update = json['task_update'] == null ? null : UpdateTaskTaskUpdate.fromJson(json['task_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskData otherTyped = other as UpdateTaskData;
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

  UpdateTaskData({
    this.task_update,
  });
}

@immutable
class UpdateTaskVariables {
  final String id;
  late final Optional<String>title;
  late final Optional<String>description;
  late final Optional<TaskStatus>status;
  late final Optional<TaskPriority>priority;
  late final Optional<Timestamp>dueDate;
  late final Optional<String>assignedToId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateTaskVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    title = Optional.optional(nativeFromJson, nativeToJson);
    title.value = json['title'] == null ? null : nativeFromJson<String>(json['title']);
  
  
    description = Optional.optional(nativeFromJson, nativeToJson);
    description.value = json['description'] == null ? null : nativeFromJson<String>(json['description']);
  
  
    status = Optional.optional((data) => TaskStatus.values.byName(data), enumSerializer);
    status.value = json['status'] == null ? null : TaskStatus.values.byName(json['status']);
  
  
    priority = Optional.optional((data) => TaskPriority.values.byName(data), enumSerializer);
    priority.value = json['priority'] == null ? null : TaskPriority.values.byName(json['priority']);
  
  
    dueDate = Optional.optional((json) => json['dueDate'] = Timestamp.fromJson(json['dueDate']), defaultSerializer);
    dueDate.value = json['dueDate'] == null ? null : Timestamp.fromJson(json['dueDate']);
  
  
    assignedToId = Optional.optional(nativeFromJson, nativeToJson);
    assignedToId.value = json['assignedToId'] == null ? null : nativeFromJson<String>(json['assignedToId']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTaskVariables otherTyped = other as UpdateTaskVariables;
    return id == otherTyped.id && 
    title == otherTyped.title && 
    description == otherTyped.description && 
    status == otherTyped.status && 
    priority == otherTyped.priority && 
    dueDate == otherTyped.dueDate && 
    assignedToId == otherTyped.assignedToId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, title.hashCode, description.hashCode, status.hashCode, priority.hashCode, dueDate.hashCode, assignedToId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(title.state == OptionalState.set) {
      json['title'] = title.toJson();
    }
    if(description.state == OptionalState.set) {
      json['description'] = description.toJson();
    }
    if(status.state == OptionalState.set) {
      json['status'] = status.toJson();
    }
    if(priority.state == OptionalState.set) {
      json['priority'] = priority.toJson();
    }
    if(dueDate.state == OptionalState.set) {
      json['dueDate'] = dueDate.toJson();
    }
    if(assignedToId.state == OptionalState.set) {
      json['assignedToId'] = assignedToId.toJson();
    }
    return json;
  }

  UpdateTaskVariables({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    required this.dueDate,
    required this.assignedToId,
  });
}

