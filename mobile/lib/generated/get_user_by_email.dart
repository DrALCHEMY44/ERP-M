part of 'example.dart';

class GetUserByEmailVariablesBuilder {
  String email;

  final FirebaseDataConnect _dataConnect;
  GetUserByEmailVariablesBuilder(this._dataConnect, {required  this.email,});
  Deserializer<GetUserByEmailData> dataDeserializer = (dynamic json)  => GetUserByEmailData.fromJson(jsonDecode(json));
  Serializer<GetUserByEmailVariables> varsSerializer = (GetUserByEmailVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetUserByEmailData, GetUserByEmailVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetUserByEmailData, GetUserByEmailVariables> ref() {
    GetUserByEmailVariables vars= GetUserByEmailVariables(email: email,);
    return _dataConnect.query("getUserByEmail", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class GetUserByEmailUsers {
  final String id;
  final String email;
  final String role;
  final String? department;
  final String? phoneNumber;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  final String? fullName;
  GetUserByEmailUsers.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  email = nativeFromJson<String>(json['email']),
  role = nativeFromJson<String>(json['role']),
  department = json['department'] == null ? null : nativeFromJson<String>(json['department']),
  phoneNumber = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  fullName = json['fullName'] == null ? null : nativeFromJson<String>(json['fullName']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetUserByEmailUsers otherTyped = other as GetUserByEmailUsers;
    return id == otherTyped.id && 
    email == otherTyped.email && 
    role == otherTyped.role && 
    department == otherTyped.department && 
    phoneNumber == otherTyped.phoneNumber && 
    createdAt == otherTyped.createdAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    fullName == otherTyped.fullName;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, email.hashCode, role.hashCode, department.hashCode, phoneNumber.hashCode, createdAt.hashCode, tenantId.hashCode, businessId.hashCode, fullName.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['email'] = nativeToJson<String>(email);
    json['role'] = nativeToJson<String>(role);
    if (department != null) {
      json['department'] = nativeToJson<String?>(department);
    }
    if (phoneNumber != null) {
      json['phoneNumber'] = nativeToJson<String?>(phoneNumber);
    }
    json['createdAt'] = createdAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    if (fullName != null) {
      json['fullName'] = nativeToJson<String?>(fullName);
    }
    return json;
  }

  GetUserByEmailUsers({
    required this.id,
    required this.email,
    required this.role,
    this.department,
    this.phoneNumber,
    required this.createdAt,
    required this.tenantId,
    required this.businessId,
    this.fullName,
  });
}

@immutable
class GetUserByEmailData {
  final List<GetUserByEmailUsers> users;
  GetUserByEmailData.fromJson(dynamic json):
  
  users = (json['users'] as List<dynamic>)
        .map((e) => GetUserByEmailUsers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetUserByEmailData otherTyped = other as GetUserByEmailData;
    return users == otherTyped.users;
    
  }
  @override
  int get hashCode => users.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  GetUserByEmailData({
    required this.users,
  });
}

@immutable
class GetUserByEmailVariables {
  final String email;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  GetUserByEmailVariables.fromJson(Map<String, dynamic> json):
  
  email = nativeFromJson<String>(json['email']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetUserByEmailVariables otherTyped = other as GetUserByEmailVariables;
    return email == otherTyped.email;
    
  }
  @override
  int get hashCode => email.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['email'] = nativeToJson<String>(email);
    return json;
  }

  GetUserByEmailVariables({
    required this.email,
  });
}

