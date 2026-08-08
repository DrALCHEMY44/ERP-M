part of 'example.dart';

class CreateTaskVariablesBuilder {
  String tenantId;
  String businessId;
  String title;
  Optional<String> _description = Optional.optional(nativeFromJson, nativeToJson);
  TaskStatus status;
  Optional<TaskPriority> _priority = Optional.optional((data) => TaskPriority.values.byName(data), enumSerializer);
  Timestamp dueDate;
  Optional<String> _assignedToId = Optional.optional(nativeFromJson, nativeToJson);
  String createdBy;

  final FirebaseDataConnect _dataConnect;  CreateTaskVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  CreateTaskVariablesBuilder priority(TaskPriority? t) {
   _priority.value = t;
   return this;
  }
  CreateTaskVariablesBuilder assignedToId(String? t) {
   _assignedToId.value = t;
   return this;
  }

  CreateTaskVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.title,required  this.status,required  this.dueDate,required  this.createdBy,});
  Deserializer<CreateTaskData> dataDeserializer = (dynamic json)  => CreateTaskData.fromJson(jsonDecode(json));
  Serializer<CreateTaskVariables> varsSerializer = (CreateTaskVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateTaskData, CreateTaskVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateTaskData, CreateTaskVariables> ref() {
    CreateTaskVariables vars= CreateTaskVariables(tenantId: tenantId,businessId: businessId,title: title,description: _description,status: status,priority: _priority,dueDate: dueDate,assignedToId: _assignedToId,createdBy: createdBy,);
    return _dataConnect.mutation("CreateTask", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateTaskTaskInsert {
  final String id;
  CreateTaskTaskInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTaskTaskInsert otherTyped = other as CreateTaskTaskInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateTaskTaskInsert({
    required this.id,
  });
}

@immutable
class CreateTaskData {
  final CreateTaskTaskInsert task_insert;
  CreateTaskData.fromJson(dynamic json):
  
  task_insert = CreateTaskTaskInsert.fromJson(json['task_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTaskData otherTyped = other as CreateTaskData;
    return task_insert == otherTyped.task_insert;
    
  }
  @override
  int get hashCode => task_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['task_insert'] = task_insert.toJson();
    return json;
  }

  CreateTaskData({
    required this.task_insert,
  });
}

@immutable
class CreateTaskVariables {
  final String tenantId;
  final String businessId;
  final String title;
  late final Optional<String>description;
  final TaskStatus status;
  late final Optional<TaskPriority>priority;
  final Timestamp dueDate;
  late final Optional<String>assignedToId;
  final String createdBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateTaskVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  title = nativeFromJson<String>(json['title']),
  status = TaskStatus.values.byName(json['status']),
  dueDate = Timestamp.fromJson(json['dueDate']),
  createdBy = nativeFromJson<String>(json['createdBy']) {
  
  
  
  
  
    description = Optional.optional(nativeFromJson, nativeToJson);
    description.value = json['description'] == null ? null : nativeFromJson<String>(json['description']);
  
  
  
    priority = Optional.optional((data) => TaskPriority.values.byName(data), enumSerializer);
    priority.value = json['priority'] == null ? null : TaskPriority.values.byName(json['priority']);
  
  
  
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

    final CreateTaskVariables otherTyped = other as CreateTaskVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    title == otherTyped.title && 
    description == otherTyped.description && 
    status == otherTyped.status && 
    priority == otherTyped.priority && 
    dueDate == otherTyped.dueDate && 
    assignedToId == otherTyped.assignedToId && 
    createdBy == otherTyped.createdBy;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, title.hashCode, description.hashCode, status.hashCode, priority.hashCode, dueDate.hashCode, assignedToId.hashCode, createdBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['title'] = nativeToJson<String>(title);
    if(description.state == OptionalState.set) {
      json['description'] = description.toJson();
    }
    json['status'] = 
    status.name
    ;
    if(priority.state == OptionalState.set) {
      json['priority'] = priority.toJson();
    }
    json['dueDate'] = dueDate.toJson();
    if(assignedToId.state == OptionalState.set) {
      json['assignedToId'] = assignedToId.toJson();
    }
    json['createdBy'] = nativeToJson<String>(createdBy);
    return json;
  }

  CreateTaskVariables({
    required this.tenantId,
    required this.businessId,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    required this.dueDate,
    required this.assignedToId,
    required this.createdBy,
  });
}

