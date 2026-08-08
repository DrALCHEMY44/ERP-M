part of 'example.dart';

class UpdateUserVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _role = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _fullName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _department = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _accessCode = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateUserVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateUserVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateUserVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  UpdateUserVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  UpdateUserVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  UpdateUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  UpdateUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateUserVariablesBuilder accessCode(String? t) {
   _accessCode.value = t;
   return this;
  }

  UpdateUserVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateUserData> dataDeserializer = (dynamic json)  => UpdateUserData.fromJson(jsonDecode(json));
  Serializer<UpdateUserVariables> varsSerializer = (UpdateUserVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateUserData, UpdateUserVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateUserData, UpdateUserVariables> ref() {
    UpdateUserVariables vars= UpdateUserVariables(id: id,tenantId: _tenantId,businessId: _businessId,email: _email,role: _role,fullName: _fullName,department: _department,phoneNumber: _phoneNumber,accessCode: _accessCode,);
    return _dataConnect.mutation("UpdateUser", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateUserUserUpdate {
  final String id;
  UpdateUserUserUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateUserUserUpdate otherTyped = other as UpdateUserUserUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateUserUserUpdate({
    required this.id,
  });
}

@immutable
class UpdateUserData {
  final UpdateUserUserUpdate? user_update;
  UpdateUserData.fromJson(dynamic json):
  
  user_update = json['user_update'] == null ? null : UpdateUserUserUpdate.fromJson(json['user_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateUserData otherTyped = other as UpdateUserData;
    return user_update == otherTyped.user_update;
    
  }
  @override
  int get hashCode => user_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (user_update != null) {
      json['user_update'] = user_update!.toJson();
    }
    return json;
  }

  UpdateUserData({
    this.user_update,
  });
}

@immutable
class UpdateUserVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>email;
  late final Optional<String>role;
  late final Optional<String>fullName;
  late final Optional<String>department;
  late final Optional<String>phoneNumber;
  late final Optional<String>accessCode;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateUserVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    email = Optional.optional(nativeFromJson, nativeToJson);
    email.value = json['email'] == null ? null : nativeFromJson<String>(json['email']);
  
  
    role = Optional.optional(nativeFromJson, nativeToJson);
    role.value = json['role'] == null ? null : nativeFromJson<String>(json['role']);
  
  
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

    final UpdateUserVariables otherTyped = other as UpdateUserVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    email == otherTyped.email && 
    role == otherTyped.role && 
    fullName == otherTyped.fullName && 
    department == otherTyped.department && 
    phoneNumber == otherTyped.phoneNumber && 
    accessCode == otherTyped.accessCode;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, email.hashCode, role.hashCode, fullName.hashCode, department.hashCode, phoneNumber.hashCode, accessCode.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(email.state == OptionalState.set) {
      json['email'] = email.toJson();
    }
    if(role.state == OptionalState.set) {
      json['role'] = role.toJson();
    }
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

  UpdateUserVariables({
    required this.id,
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

