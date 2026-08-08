part of 'example.dart';

class UpdateEmployeeVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _fullName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _position = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _role = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _salary = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _department = Optional.optional(nativeFromJson, nativeToJson);
  Optional<DateTime> _startDate = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _status = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateEmployeeVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder position(String? t) {
   _position.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder salary(double? t) {
   _salary.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder startDate(DateTime? t) {
   _startDate.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  UpdateEmployeeVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateEmployeeData> dataDeserializer = (dynamic json)  => UpdateEmployeeData.fromJson(jsonDecode(json));
  Serializer<UpdateEmployeeVariables> varsSerializer = (UpdateEmployeeVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateEmployeeData, UpdateEmployeeVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateEmployeeData, UpdateEmployeeVariables> ref() {
    UpdateEmployeeVariables vars= UpdateEmployeeVariables(id: id,tenantId: _tenantId,businessId: _businessId,fullName: _fullName,position: _position,role: _role,salary: _salary,department: _department,startDate: _startDate,status: _status,);
    return _dataConnect.mutation("UpdateEmployee", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateEmployeeEmployeeUpdate {
  final String id;
  UpdateEmployeeEmployeeUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeEmployeeUpdate otherTyped = other as UpdateEmployeeEmployeeUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateEmployeeEmployeeUpdate({
    required this.id,
  });
}

@immutable
class UpdateEmployeeData {
  final UpdateEmployeeEmployeeUpdate? employee_update;
  UpdateEmployeeData.fromJson(dynamic json):
  
  employee_update = json['employee_update'] == null ? null : UpdateEmployeeEmployeeUpdate.fromJson(json['employee_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeData otherTyped = other as UpdateEmployeeData;
    return employee_update == otherTyped.employee_update;
    
  }
  @override
  int get hashCode => employee_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (employee_update != null) {
      json['employee_update'] = employee_update!.toJson();
    }
    return json;
  }

  UpdateEmployeeData({
    this.employee_update,
  });
}

@immutable
class UpdateEmployeeVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>fullName;
  late final Optional<String>position;
  late final Optional<String>role;
  late final Optional<double>salary;
  late final Optional<String>department;
  late final Optional<DateTime>startDate;
  late final Optional<String>status;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateEmployeeVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    fullName = Optional.optional(nativeFromJson, nativeToJson);
    fullName.value = json['fullName'] == null ? null : nativeFromJson<String>(json['fullName']);
  
  
    position = Optional.optional(nativeFromJson, nativeToJson);
    position.value = json['position'] == null ? null : nativeFromJson<String>(json['position']);
  
  
    role = Optional.optional(nativeFromJson, nativeToJson);
    role.value = json['role'] == null ? null : nativeFromJson<String>(json['role']);
  
  
    salary = Optional.optional(nativeFromJson, nativeToJson);
    salary.value = json['salary'] == null ? null : nativeFromJson<double>(json['salary']);
  
  
    department = Optional.optional(nativeFromJson, nativeToJson);
    department.value = json['department'] == null ? null : nativeFromJson<String>(json['department']);
  
  
    startDate = Optional.optional(nativeFromJson, nativeToJson);
    startDate.value = json['startDate'] == null ? null : nativeFromJson<DateTime>(json['startDate']);
  
  
    status = Optional.optional(nativeFromJson, nativeToJson);
    status.value = json['status'] == null ? null : nativeFromJson<String>(json['status']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeVariables otherTyped = other as UpdateEmployeeVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    fullName == otherTyped.fullName && 
    position == otherTyped.position && 
    role == otherTyped.role && 
    salary == otherTyped.salary && 
    department == otherTyped.department && 
    startDate == otherTyped.startDate && 
    status == otherTyped.status;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, fullName.hashCode, position.hashCode, role.hashCode, salary.hashCode, department.hashCode, startDate.hashCode, status.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(fullName.state == OptionalState.set) {
      json['fullName'] = fullName.toJson();
    }
    if(position.state == OptionalState.set) {
      json['position'] = position.toJson();
    }
    if(role.state == OptionalState.set) {
      json['role'] = role.toJson();
    }
    if(salary.state == OptionalState.set) {
      json['salary'] = salary.toJson();
    }
    if(department.state == OptionalState.set) {
      json['department'] = department.toJson();
    }
    if(startDate.state == OptionalState.set) {
      json['startDate'] = startDate.toJson();
    }
    if(status.state == OptionalState.set) {
      json['status'] = status.toJson();
    }
    return json;
  }

  UpdateEmployeeVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.fullName,
    required this.position,
    required this.role,
    required this.salary,
    required this.department,
    required this.startDate,
    required this.status,
  });
}

