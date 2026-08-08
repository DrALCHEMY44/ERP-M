part of 'example.dart';

class VerifyEmployeeAccessVariablesBuilder {
  String fullName;
  String role;
  String accessCode;
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  VerifyEmployeeAccessVariablesBuilder(this._dataConnect, {required  this.fullName,required  this.role,required  this.accessCode,required  this.tenantId,required  this.businessId,});
  Deserializer<VerifyEmployeeAccessData> dataDeserializer = (dynamic json)  => VerifyEmployeeAccessData.fromJson(jsonDecode(json));
  Serializer<VerifyEmployeeAccessVariables> varsSerializer = (VerifyEmployeeAccessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables> ref() {
    VerifyEmployeeAccessVariables vars= VerifyEmployeeAccessVariables(fullName: fullName,role: role,accessCode: accessCode,tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("verifyEmployeeAccess", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class VerifyEmployeeAccessUsers {
  final String id;
  final String email;
  final String role;
  final String? fullName;
  final String tenantId;
  final String businessId;
  VerifyEmployeeAccessUsers.fromJson(dynamic json):
  
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

    final VerifyEmployeeAccessUsers otherTyped = other as VerifyEmployeeAccessUsers;
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

  VerifyEmployeeAccessUsers({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class VerifyEmployeeAccessData {
  final List<VerifyEmployeeAccessUsers> users;
  VerifyEmployeeAccessData.fromJson(dynamic json):
  
  users = (json['users'] as List<dynamic>)
        .map((e) => VerifyEmployeeAccessUsers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final VerifyEmployeeAccessData otherTyped = other as VerifyEmployeeAccessData;
    return users == otherTyped.users;
    
  }
  @override
  int get hashCode => users.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  VerifyEmployeeAccessData({
    required this.users,
  });
}

@immutable
class VerifyEmployeeAccessVariables {
  final String fullName;
  final String role;
  final String accessCode;
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  VerifyEmployeeAccessVariables.fromJson(Map<String, dynamic> json):
  
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

    final VerifyEmployeeAccessVariables otherTyped = other as VerifyEmployeeAccessVariables;
    return fullName == otherTyped.fullName && 
    role == otherTyped.role && 
    accessCode == otherTyped.accessCode && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([fullName.hashCode, role.hashCode, accessCode.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['fullName'] = nativeToJson<String>(fullName);
    json['role'] = nativeToJson<String>(role);
    json['accessCode'] = nativeToJson<String>(accessCode);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  VerifyEmployeeAccessVariables({
    required this.fullName,
    required this.role,
    required this.accessCode,
    required this.tenantId,
    required this.businessId,
  });
}

