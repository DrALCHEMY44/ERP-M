part of 'example.dart';

class ListEmployeesByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListEmployeesByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListEmployeesByBusinessData> dataDeserializer = (dynamic json)  => ListEmployeesByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListEmployeesByBusinessVariables> varsSerializer = (ListEmployeesByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables> ref() {
    ListEmployeesByBusinessVariables vars= ListEmployeesByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listEmployeesByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListEmployeesByBusinessEmployees {
  final String id;
  final String fullName;
  final String position;
  final String? role;
  final double? salary;
  final String? department;
  final DateTime? startDate;
  final String? status;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  final String? code;
  ListEmployeesByBusinessEmployees.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  fullName = nativeFromJson<String>(json['fullName']),
  position = nativeFromJson<String>(json['position']),
  role = json['role'] == null ? null : nativeFromJson<String>(json['role']),
  salary = json['salary'] == null ? null : nativeFromJson<double>(json['salary']),
  department = json['department'] == null ? null : nativeFromJson<String>(json['department']),
  startDate = json['startDate'] == null ? null : nativeFromJson<DateTime>(json['startDate']),
  status = json['status'] == null ? null : nativeFromJson<String>(json['status']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  code = json['code'] == null ? null : nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListEmployeesByBusinessEmployees otherTyped = other as ListEmployeesByBusinessEmployees;
    return id == otherTyped.id && 
    fullName == otherTyped.fullName && 
    position == otherTyped.position && 
    role == otherTyped.role && 
    salary == otherTyped.salary && 
    department == otherTyped.department && 
    startDate == otherTyped.startDate && 
    status == otherTyped.status && 
    createdAt == otherTyped.createdAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, fullName.hashCode, position.hashCode, role.hashCode, salary.hashCode, department.hashCode, startDate.hashCode, status.hashCode, createdAt.hashCode, tenantId.hashCode, businessId.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['fullName'] = nativeToJson<String>(fullName);
    json['position'] = nativeToJson<String>(position);
    if (role != null) {
      json['role'] = nativeToJson<String?>(role);
    }
    if (salary != null) {
      json['salary'] = nativeToJson<double?>(salary);
    }
    if (department != null) {
      json['department'] = nativeToJson<String?>(department);
    }
    if (startDate != null) {
      json['startDate'] = nativeToJson<DateTime?>(startDate);
    }
    if (status != null) {
      json['status'] = nativeToJson<String?>(status);
    }
    json['createdAt'] = createdAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    if (code != null) {
      json['code'] = nativeToJson<String?>(code);
    }
    return json;
  }

  ListEmployeesByBusinessEmployees({
    required this.id,
    required this.fullName,
    required this.position,
    this.role,
    this.salary,
    this.department,
    this.startDate,
    this.status,
    required this.createdAt,
    required this.tenantId,
    required this.businessId,
    this.code,
  });
}

@immutable
class ListEmployeesByBusinessData {
  final List<ListEmployeesByBusinessEmployees> employees;
  ListEmployeesByBusinessData.fromJson(dynamic json):
  
  employees = (json['employees'] as List<dynamic>)
        .map((e) => ListEmployeesByBusinessEmployees.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListEmployeesByBusinessData otherTyped = other as ListEmployeesByBusinessData;
    return employees == otherTyped.employees;
    
  }
  @override
  int get hashCode => employees.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['employees'] = employees.map((e) => e.toJson()).toList();
    return json;
  }

  ListEmployeesByBusinessData({
    required this.employees,
  });
}

@immutable
class ListEmployeesByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListEmployeesByBusinessVariables.fromJson(Map<String, dynamic> json):
  
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

    final ListEmployeesByBusinessVariables otherTyped = other as ListEmployeesByBusinessVariables;
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

  ListEmployeesByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

