part of 'example.dart';

class ListTasksByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListTasksByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListTasksByBusinessData> dataDeserializer = (dynamic json)  => ListTasksByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListTasksByBusinessVariables> varsSerializer = (ListTasksByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListTasksByBusinessData, ListTasksByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListTasksByBusinessData, ListTasksByBusinessVariables> ref() {
    ListTasksByBusinessVariables vars= ListTasksByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listTasksByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListTasksByBusinessTasks {
  final String id;
  final String title;
  final String? description;
  final EnumValue<TaskStatus> status;
  final EnumValue<TaskPriority>? priority;
  final Timestamp dueDate;
  final ListTasksByBusinessTasksAssignedTo? assignedTo;
  final String createdBy;
  final Timestamp createdAt;
  final Timestamp? updatedAt;
  final String tenantId;
  final String businessId;
  ListTasksByBusinessTasks.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  title = nativeFromJson<String>(json['title']),
  description = json['description'] == null ? null : nativeFromJson<String>(json['description']),
  status = taskStatusDeserializer(json['status']),
  priority = json['priority'] == null ? null : taskPriorityDeserializer(json['priority']),
  dueDate = Timestamp.fromJson(json['dueDate']),
  assignedTo = json['assignedTo'] == null ? null : ListTasksByBusinessTasksAssignedTo.fromJson(json['assignedTo']),
  createdBy = nativeFromJson<String>(json['createdBy']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  updatedAt = json['updatedAt'] == null ? null : Timestamp.fromJson(json['updatedAt']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTasksByBusinessTasks otherTyped = other as ListTasksByBusinessTasks;
    return id == otherTyped.id && 
    title == otherTyped.title && 
    description == otherTyped.description && 
    status == otherTyped.status && 
    priority == otherTyped.priority && 
    dueDate == otherTyped.dueDate && 
    assignedTo == otherTyped.assignedTo && 
    createdBy == otherTyped.createdBy && 
    createdAt == otherTyped.createdAt && 
    updatedAt == otherTyped.updatedAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, title.hashCode, description.hashCode, status.hashCode, priority.hashCode, dueDate.hashCode, assignedTo.hashCode, createdBy.hashCode, createdAt.hashCode, updatedAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['title'] = nativeToJson<String>(title);
    if (description != null) {
      json['description'] = nativeToJson<String?>(description);
    }
    json['status'] = 
    taskStatusSerializer(status)
    ;
    if (priority != null) {
      json['priority'] = 
    taskPrioritySerializer(priority!)
    ;
    }
    json['dueDate'] = dueDate.toJson();
    if (assignedTo != null) {
      json['assignedTo'] = assignedTo!.toJson();
    }
    json['createdBy'] = nativeToJson<String>(createdBy);
    json['createdAt'] = createdAt.toJson();
    if (updatedAt != null) {
      json['updatedAt'] = updatedAt!.toJson();
    }
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListTasksByBusinessTasks({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    this.priority,
    required this.dueDate,
    this.assignedTo,
    required this.createdBy,
    required this.createdAt,
    this.updatedAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListTasksByBusinessTasksAssignedTo {
  final String id;
  final String email;
  final String role;
  final String? fullName;
  ListTasksByBusinessTasksAssignedTo.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  email = nativeFromJson<String>(json['email']),
  role = nativeFromJson<String>(json['role']),
  fullName = json['fullName'] == null ? null : nativeFromJson<String>(json['fullName']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTasksByBusinessTasksAssignedTo otherTyped = other as ListTasksByBusinessTasksAssignedTo;
    return id == otherTyped.id && 
    email == otherTyped.email && 
    role == otherTyped.role && 
    fullName == otherTyped.fullName;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, email.hashCode, role.hashCode, fullName.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['email'] = nativeToJson<String>(email);
    json['role'] = nativeToJson<String>(role);
    if (fullName != null) {
      json['fullName'] = nativeToJson<String?>(fullName);
    }
    return json;
  }

  ListTasksByBusinessTasksAssignedTo({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
  });
}

@immutable
class ListTasksByBusinessData {
  final List<ListTasksByBusinessTasks> tasks;
  ListTasksByBusinessData.fromJson(dynamic json):
  
  tasks = (json['tasks'] as List<dynamic>)
        .map((e) => ListTasksByBusinessTasks.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTasksByBusinessData otherTyped = other as ListTasksByBusinessData;
    return tasks == otherTyped.tasks;
    
  }
  @override
  int get hashCode => tasks.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tasks'] = tasks.map((e) => e.toJson()).toList();
    return json;
  }

  ListTasksByBusinessData({
    required this.tasks,
  });
}

@immutable
class ListTasksByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListTasksByBusinessVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTasksByBusinessVariables otherTyped = other as ListTasksByBusinessVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListTasksByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

