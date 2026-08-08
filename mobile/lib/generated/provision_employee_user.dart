part of 'example.dart';

class ProvisionEmployeeUserVariablesBuilder {
  String tenantId;
  String businessId;
  String email;
  String role;
  String fullName;
  Optional<String> _department = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  String accessCode;

  final FirebaseDataConnect _dataConnect;  ProvisionEmployeeUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  ProvisionEmployeeUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }

  ProvisionEmployeeUserVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.email,required  this.role,required  this.fullName,required  this.accessCode,});
  Deserializer<ProvisionEmployeeUserData> dataDeserializer = (dynamic json)  => ProvisionEmployeeUserData.fromJson(jsonDecode(json));
  Serializer<ProvisionEmployeeUserVariables> varsSerializer = (ProvisionEmployeeUserVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>> execute() {
    return ref().execute();
  }

  MutationRef<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables> ref() {
    ProvisionEmployeeUserVariables vars= ProvisionEmployeeUserVariables(tenantId: tenantId,businessId: businessId,email: email,role: role,fullName: fullName,department: _department,phoneNumber: _phoneNumber,accessCode: accessCode,);
    return _dataConnect.mutation("ProvisionEmployeeUser", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ProvisionEmployeeUserUserInsert {
  final String id;
  ProvisionEmployeeUserUserInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ProvisionEmployeeUserUserInsert otherTyped = other as ProvisionEmployeeUserUserInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  ProvisionEmployeeUserUserInsert({
    required this.id,
  });
}

@immutable
class ProvisionEmployeeUserData {
  final ProvisionEmployeeUserUserInsert user_insert;
  ProvisionEmployeeUserData.fromJson(dynamic json):
  
  user_insert = ProvisionEmployeeUserUserInsert.fromJson(json['user_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ProvisionEmployeeUserData otherTyped = other as ProvisionEmployeeUserData;
    return user_insert == otherTyped.user_insert;
    
  }
  @override
  int get hashCode => user_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['user_insert'] = user_insert.toJson();
    return json;
  }

  ProvisionEmployeeUserData({
    required this.user_insert,
  });
}

@immutable
class ProvisionEmployeeUserVariables {
  final String tenantId;
  final String businessId;
  final String email;
  final String role;
  final String fullName;
  late final Optional<String>department;
  late final Optional<String>phoneNumber;
  final String accessCode;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ProvisionEmployeeUserVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  email = nativeFromJson<String>(json['email']),
  role = nativeFromJson<String>(json['role']),
  fullName = nativeFromJson<String>(json['fullName']),
  accessCode = nativeFromJson<String>(json['accessCode']) {
  
  
  
  
  
  
  
    department = Optional.optional(nativeFromJson, nativeToJson);
    department.value = json['department'] == null ? null : nativeFromJson<String>(json['department']);
  
  
    phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
    phoneNumber.value = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']);
  
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ProvisionEmployeeUserVariables otherTyped = other as ProvisionEmployeeUserVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    email == otherTyped.email && 
    role == otherTyped.role && 
    fullName == otherTyped.fullName && 
    department == otherTyped.department && 
    phoneNumber == otherTyped.phoneNumber && 
    accessCode == otherTyped.accessCode;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, email.hashCode, role.hashCode, fullName.hashCode, department.hashCode, phoneNumber.hashCode, accessCode.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['email'] = nativeToJson<String>(email);
    json['role'] = nativeToJson<String>(role);
    json['fullName'] = nativeToJson<String>(fullName);
    if(department.state == OptionalState.set) {
      json['department'] = department.toJson();
    }
    if(phoneNumber.state == OptionalState.set) {
      json['phoneNumber'] = phoneNumber.toJson();
    }
    json['accessCode'] = nativeToJson<String>(accessCode);
    return json;
  }

  ProvisionEmployeeUserVariables({
    required this.tenantId,
    required this.businessId,
    required this.email,
    required this.role,
    required this.fullName,
    required this.department,
    required this.phoneNumber,
    required this.accessCode,
  });
}

