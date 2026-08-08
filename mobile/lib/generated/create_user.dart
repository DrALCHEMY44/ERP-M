part of 'example.dart';

class CreateUserVariablesBuilder {
  String tenantId;
  String businessId;
  String email;
  String role;
  Optional<String> _fullName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _department = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _accessCode = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateUserVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  CreateUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  CreateUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateUserVariablesBuilder accessCode(String? t) {
   _accessCode.value = t;
   return this;
  }

  CreateUserVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.email,required  this.role,});
  Deserializer<CreateUserData> dataDeserializer = (dynamic json)  => CreateUserData.fromJson(jsonDecode(json));
  Serializer<CreateUserVariables> varsSerializer = (CreateUserVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateUserData, CreateUserVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateUserData, CreateUserVariables> ref() {
    CreateUserVariables vars= CreateUserVariables(tenantId: tenantId,businessId: businessId,email: email,role: role,fullName: _fullName,department: _department,phoneNumber: _phoneNumber,accessCode: _accessCode,);
    return _dataConnect.mutation("CreateUser", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateUserUserInsert {
  final String id;
  CreateUserUserInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateUserUserInsert otherTyped = other as CreateUserUserInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateUserUserInsert({
    required this.id,
  });
}

@immutable
class CreateUserData {
  final CreateUserUserInsert user_insert;
  CreateUserData.fromJson(dynamic json):
  
  user_insert = CreateUserUserInsert.fromJson(json['user_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateUserData otherTyped = other as CreateUserData;
    return user_insert == otherTyped.user_insert;
    
  }
  @override
  int get hashCode => user_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['user_insert'] = user_insert.toJson();
    return json;
  }

  CreateUserData({
    required this.user_insert,
  });
}

@immutable
class CreateUserVariables {
  final String tenantId;
  final String businessId;
  final String email;
  final String role;
  late final Optional<String>fullName;
  late final Optional<String>department;
  late final Optional<String>phoneNumber;
  late final Optional<String>accessCode;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateUserVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  email = nativeFromJson<String>(json['email']),
  role = nativeFromJson<String>(json['role']) {
  
  
  
  
  
  
    fullName = Optional.optional(nativeFromJson, nativeToJson);
    fullName.value = json['fullName'] == null ? null : nativeFromJson<String>(json['fullName']);
  
  
    department = Optional.optional(nativeFromJson, nativeToJson);
    department.value = json['department'] == null ? null : nativeFromJson<String>(json['department']);
  
  
    phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
    phoneNumber.value = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']);
  
  
    accessCode = Optional.optional(nativeFromJson, nativeToJson);
    accessCode.value = json['accessCode'] == null ? null : nativeFromJson<String>(json['accessCode']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateUserVariables otherTyped = other as CreateUserVariables;
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
    if(fullName.state == OptionalState.set) {
      json['fullName'] = fullName.toJson();
    }
    if(department.state == OptionalState.set) {
      json['department'] = department.toJson();
    }
    if(phoneNumber.state == OptionalState.set) {
      json['phoneNumber'] = phoneNumber.toJson();
    }
    if(accessCode.state == OptionalState.set) {
      json['accessCode'] = accessCode.toJson();
    }
    return json;
  }

  CreateUserVariables({
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

