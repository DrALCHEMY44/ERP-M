part of 'example.dart';

class ListUsersByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListUsersByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListUsersByBusinessData> dataDeserializer = (dynamic json)  => ListUsersByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListUsersByBusinessVariables> varsSerializer = (ListUsersByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListUsersByBusinessData, ListUsersByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListUsersByBusinessData, ListUsersByBusinessVariables> ref() {
    ListUsersByBusinessVariables vars= ListUsersByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listUsersByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListUsersByBusinessUsers {
  final String id;
  final String email;
  final String role;
  final String? department;
  final String? phoneNumber;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  final String? fullName;
  ListUsersByBusinessUsers.fromJson(dynamic json):
  
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

    final ListUsersByBusinessUsers otherTyped = other as ListUsersByBusinessUsers;
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

  ListUsersByBusinessUsers({
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
class ListUsersByBusinessData {
  final List<ListUsersByBusinessUsers> users;
  ListUsersByBusinessData.fromJson(dynamic json):
  
  users = (json['users'] as List<dynamic>)
        .map((e) => ListUsersByBusinessUsers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListUsersByBusinessData otherTyped = other as ListUsersByBusinessData;
    return users == otherTyped.users;
    
  }
  @override
  int get hashCode => users.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  ListUsersByBusinessData({
    required this.users,
  });
}

@immutable
class ListUsersByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListUsersByBusinessVariables.fromJson(Map<String, dynamic> json):
  
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

    final ListUsersByBusinessVariables otherTyped = other as ListUsersByBusinessVariables;
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

  ListUsersByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

