part of 'example.dart';

class VerifyUserLoginVariablesBuilder {
  String email;
  String fullName;
  String role;
  String accessCode;
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  VerifyUserLoginVariablesBuilder(this._dataConnect, {required  this.email,required  this.fullName,required  this.role,required  this.accessCode,required  this.tenantId,required  this.businessId,});
  Deserializer<VerifyUserLoginData> dataDeserializer = (dynamic json)  => VerifyUserLoginData.fromJson(jsonDecode(json));
  Serializer<VerifyUserLoginVariables> varsSerializer = (VerifyUserLoginVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<VerifyUserLoginData, VerifyUserLoginVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<VerifyUserLoginData, VerifyUserLoginVariables> ref() {
    VerifyUserLoginVariables vars= VerifyUserLoginVariables(email: email,fullName: fullName,role: role,accessCode: accessCode,tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("verifyUserLogin", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class VerifyUserLoginUsers {
  final String id;
  final String email;
  final String role;
  final String? fullName;
  final String tenantId;
  final String businessId;
  VerifyUserLoginUsers.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  email = nativeFromJson<String>(json['email']),
  role = nativeFromJson<String>(json['role']),
  fullName = json['fullName'] == null ? null : nativeFromJson<String>(json['fullName']),
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

    final VerifyUserLoginUsers otherTyped = other as VerifyUserLoginUsers;
    return id == otherTyped.id && 
    email == otherTyped.email && 
    role == otherTyped.role && 
    fullName == otherTyped.fullName && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, email.hashCode, role.hashCode, fullName.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['email'] = nativeToJson<String>(email);
    json['role'] = nativeToJson<String>(role);
    if (fullName != null) {
      json['fullName'] = nativeToJson<String?>(fullName);
    }
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  VerifyUserLoginUsers({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class VerifyUserLoginData {
  final List<VerifyUserLoginUsers> users;
  VerifyUserLoginData.fromJson(dynamic json):
  
  users = (json['users'] as List<dynamic>)
        .map((e) => VerifyUserLoginUsers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final VerifyUserLoginData otherTyped = other as VerifyUserLoginData;
    return users == otherTyped.users;
    
  }
  @override
  int get hashCode => users.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  VerifyUserLoginData({
    required this.users,
  });
}

@immutable
class VerifyUserLoginVariables {
  final String email;
  final String fullName;
  final String role;
  final String accessCode;
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  VerifyUserLoginVariables.fromJson(Map<String, dynamic> json):
  
  email = nativeFromJson<String>(json['email']),
  fullName = nativeFromJson<String>(json['fullName']),
  role = nativeFromJson<String>(json['role']),
  accessCode = nativeFromJson<String>(json['accessCode']),
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

    final VerifyUserLoginVariables otherTyped = other as VerifyUserLoginVariables;
    return email == otherTyped.email && 
    fullName == otherTyped.fullName && 
    role == otherTyped.role && 
    accessCode == otherTyped.accessCode && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([email.hashCode, fullName.hashCode, role.hashCode, accessCode.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['email'] = nativeToJson<String>(email);
    json['fullName'] = nativeToJson<String>(fullName);
    json['role'] = nativeToJson<String>(role);
    json['accessCode'] = nativeToJson<String>(accessCode);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  VerifyUserLoginVariables({
    required this.email,
    required this.fullName,
    required this.role,
    required this.accessCode,
    required this.tenantId,
    required this.businessId,
  });
}

