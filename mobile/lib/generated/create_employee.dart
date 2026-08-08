part of 'example.dart';

class CreateEmployeeVariablesBuilder {
  String tenantId;
  String businessId;
  String fullName;
  String position;
  Optional<String> _role = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _salary = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _department = Optional.optional(nativeFromJson, nativeToJson);
  Optional<DateTime> _startDate = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _status = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _code = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateEmployeeVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder salary(double? t) {
   _salary.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder startDate(DateTime? t) {
   _startDate.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder code(String? t) {
   _code.value = t;
   return this;
  }

  CreateEmployeeVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.fullName,required  this.position,});
  Deserializer<CreateEmployeeData> dataDeserializer = (dynamic json)  => CreateEmployeeData.fromJson(jsonDecode(json));
  Serializer<CreateEmployeeVariables> varsSerializer = (CreateEmployeeVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateEmployeeData, CreateEmployeeVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateEmployeeData, CreateEmployeeVariables> ref() {
    CreateEmployeeVariables vars= CreateEmployeeVariables(tenantId: tenantId,businessId: businessId,fullName: fullName,position: position,role: _role,salary: _salary,department: _department,startDate: _startDate,status: _status,code: _code,);
    return _dataConnect.mutation("CreateEmployee", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateEmployeeEmployeeInsert {
  final String id;
  CreateEmployeeEmployeeInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeEmployeeInsert otherTyped = other as CreateEmployeeEmployeeInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateEmployeeEmployeeInsert({
    required this.id,
  });
}

@immutable
class CreateEmployeeData {
  final CreateEmployeeEmployeeInsert employee_insert;
  CreateEmployeeData.fromJson(dynamic json):
  
  employee_insert = CreateEmployeeEmployeeInsert.fromJson(json['employee_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeData otherTyped = other as CreateEmployeeData;
    return employee_insert == otherTyped.employee_insert;
    
  }
  @override
  int get hashCode => employee_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['employee_insert'] = employee_insert.toJson();
    return json;
  }

  CreateEmployeeData({
    required this.employee_insert,
  });
}

@immutable
class CreateEmployeeVariables {
  final String tenantId;
  final String businessId;
  final String fullName;
  final String position;
  late final Optional<String>role;
  late final Optional<double>salary;
  late final Optional<String>department;
  late final Optional<DateTime>startDate;
  late final Optional<String>status;
  late final Optional<String>code;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateEmployeeVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  fullName = nativeFromJson<String>(json['fullName']),
  position = nativeFromJson<String>(json['position']) {
  
  
  
  
  
  
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
  
  
    code = Optional.optional(nativeFromJson, nativeToJson);
    code.value = json['code'] == null ? null : nativeFromJson<String>(json['code']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeVariables otherTyped = other as CreateEmployeeVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    fullName == otherTyped.fullName && 
    position == otherTyped.position && 
    role == otherTyped.role && 
    salary == otherTyped.salary && 
    department == otherTyped.department && 
    startDate == otherTyped.startDate && 
    status == otherTyped.status && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, fullName.hashCode, position.hashCode, role.hashCode, salary.hashCode, department.hashCode, startDate.hashCode, status.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['fullName'] = nativeToJson<String>(fullName);
    json['position'] = nativeToJson<String>(position);
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
    if(code.state == OptionalState.set) {
      json['code'] = code.toJson();
    }
    return json;
  }

  CreateEmployeeVariables({
    required this.tenantId,
    required this.businessId,
    required this.fullName,
    required this.position,
    required this.role,
    required this.salary,
    required this.department,
    required this.startDate,
    required this.status,
    required this.code,
  });
}

