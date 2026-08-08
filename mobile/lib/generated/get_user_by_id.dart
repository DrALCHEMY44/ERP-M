part of 'example.dart';

class GetUserByIdVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  GetUserByIdVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<GetUserByIdData> dataDeserializer = (dynamic json)  => GetUserByIdData.fromJson(jsonDecode(json));
  Serializer<GetUserByIdVariables> varsSerializer = (GetUserByIdVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetUserByIdData, GetUserByIdVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetUserByIdData, GetUserByIdVariables> ref() {
    GetUserByIdVariables vars= GetUserByIdVariables(id: id,);
    return _dataConnect.query("getUserById", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class GetUserByIdUser {
  final String id;
  final String email;
  final String role;
  final String? department;
  final String? phoneNumber;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  final String? fullName;
  GetUserByIdUser.fromJson(dynamic json):
  
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

    final GetUserByIdUser otherTyped = other as GetUserByIdUser;
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

  GetUserByIdUser({
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
class GetUserByIdData {
  final GetUserByIdUser? user;
  GetUserByIdData.fromJson(dynamic json):
  
  user = json['user'] == null ? null : GetUserByIdUser.fromJson(json['user']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetUserByIdData otherTyped = other as GetUserByIdData;
    return user == otherTyped.user;
    
  }
  @override
  int get hashCode => user.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (user != null) {
      json['user'] = user!.toJson();
    }
    return json;
  }

  GetUserByIdData({
    this.user,
  });
}

@immutable
class GetUserByIdVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  GetUserByIdVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetUserByIdVariables otherTyped = other as GetUserByIdVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  GetUserByIdVariables({
    required this.id,
  });
}

