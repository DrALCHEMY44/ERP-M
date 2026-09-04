part of 'example.dart';

class ListTaskAssigneesByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListTaskAssigneesByBusinessVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
  });
  Deserializer<ListTaskAssigneesByBusinessData> dataDeserializer =
      (dynamic json) =>
          ListTaskAssigneesByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListTaskAssigneesByBusinessVariables> varsSerializer =
      (ListTaskAssigneesByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<
    QueryResult<
      ListTaskAssigneesByBusinessData,
      ListTaskAssigneesByBusinessVariables
    >
  >
  execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<
    ListTaskAssigneesByBusinessData,
    ListTaskAssigneesByBusinessVariables
  >
  ref() {
    ListTaskAssigneesByBusinessVariables vars =
        ListTaskAssigneesByBusinessVariables(
          tenantId: tenantId,
          businessId: businessId,
        );
    return _dataConnect.query(
      "listTaskAssigneesByBusiness",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class ListTaskAssigneesByBusinessUsers {
  final String id;
  final String email;
  final String role;
  final String? fullName;
  final String? department;
  final String tenantId;
  final String businessId;
  ListTaskAssigneesByBusinessUsers.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']),
      email = nativeFromJson<String>(json['email']),
      role = nativeFromJson<String>(json['role']),
      fullName = json['fullName'] == null
          ? null
          : nativeFromJson<String>(json['fullName']),
      department = json['department'] == null
          ? null
          : nativeFromJson<String>(json['department']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListTaskAssigneesByBusinessUsers otherTyped =
        other as ListTaskAssigneesByBusinessUsers;
    return id == otherTyped.id &&
        email == otherTyped.email &&
        role == otherTyped.role &&
        fullName == otherTyped.fullName &&
        department == otherTyped.department &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    email.hashCode,
    role.hashCode,
    fullName.hashCode,
    department.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['email'] = nativeToJson<String>(email);
    json['role'] = nativeToJson<String>(role);
    if (fullName != null) {
      json['fullName'] = nativeToJson<String?>(fullName);
    }
    if (department != null) {
      json['department'] = nativeToJson<String?>(department);
    }
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListTaskAssigneesByBusinessUsers({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
    this.department,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListTaskAssigneesByBusinessData {
  final List<ListTaskAssigneesByBusinessUsers> users;
  ListTaskAssigneesByBusinessData.fromJson(dynamic json)
    : users = (json['users'] as List<dynamic>)
          .map((e) => ListTaskAssigneesByBusinessUsers.fromJson(e))
          .toList();
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListTaskAssigneesByBusinessData otherTyped =
        other as ListTaskAssigneesByBusinessData;
    return users == otherTyped.users;
  }

  @override
  int get hashCode => users.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  ListTaskAssigneesByBusinessData({required this.users});
}

@immutable
class ListTaskAssigneesByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  ListTaskAssigneesByBusinessVariables.fromJson(Map<String, dynamic> json)
    : tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListTaskAssigneesByBusinessVariables otherTyped =
        other as ListTaskAssigneesByBusinessVariables;
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

  ListTaskAssigneesByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}
