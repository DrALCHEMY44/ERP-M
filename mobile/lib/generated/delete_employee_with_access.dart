part of 'example.dart';

class DeleteEmployeeWithAccessVariablesBuilder {
  String id;
  String tenantId;
  String businessId;
  String currentEmail;

  final FirebaseDataConnect _dataConnect;
  DeleteEmployeeWithAccessVariablesBuilder(
    this._dataConnect, {
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.currentEmail,
  });
  Deserializer<DeleteEmployeeWithAccessData> dataDeserializer =
      (dynamic json) => DeleteEmployeeWithAccessData.fromJson(jsonDecode(json));
  Serializer<DeleteEmployeeWithAccessVariables> varsSerializer =
      (DeleteEmployeeWithAccessVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<
      DeleteEmployeeWithAccessData,
      DeleteEmployeeWithAccessVariables
    >
  >
  execute() {
    return ref().execute();
  }

  MutationRef<DeleteEmployeeWithAccessData, DeleteEmployeeWithAccessVariables>
  ref() {
    DeleteEmployeeWithAccessVariables vars = DeleteEmployeeWithAccessVariables(
      id: id,
      tenantId: tenantId,
      businessId: businessId,
      currentEmail: currentEmail,
    );
    return _dataConnect.mutation(
      "DeleteEmployeeWithAccess",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class DeleteEmployeeWithAccessEmployeeDelete {
  final String id;
  DeleteEmployeeWithAccessEmployeeDelete.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeWithAccessEmployeeDelete otherTyped =
        other as DeleteEmployeeWithAccessEmployeeDelete;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteEmployeeWithAccessEmployeeDelete({required this.id});
}

@immutable
class DeleteEmployeeWithAccessData {
  final DeleteEmployeeWithAccessEmployeeDelete? employee_delete;
  final int user_deleteMany;
  DeleteEmployeeWithAccessData.fromJson(dynamic json)
    : employee_delete = json['employee_delete'] == null
          ? null
          : DeleteEmployeeWithAccessEmployeeDelete.fromJson(
              json['employee_delete'],
            ),
      user_deleteMany = nativeFromJson<int>(json['user_deleteMany']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeWithAccessData otherTyped =
        other as DeleteEmployeeWithAccessData;
    return employee_delete == otherTyped.employee_delete &&
        user_deleteMany == otherTyped.user_deleteMany;
  }

  @override
  int get hashCode =>
      Object.hashAll([employee_delete.hashCode, user_deleteMany.hashCode]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (employee_delete != null) {
      json['employee_delete'] = employee_delete!.toJson();
    }
    json['user_deleteMany'] = nativeToJson<int>(user_deleteMany);
    return json;
  }

  DeleteEmployeeWithAccessData({
    this.employee_delete,
    required this.user_deleteMany,
  });
}

@immutable
class DeleteEmployeeWithAccessVariables {
  final String id;
  final String tenantId;
  final String businessId;
  final String currentEmail;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  DeleteEmployeeWithAccessVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      currentEmail = nativeFromJson<String>(json['currentEmail']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeWithAccessVariables otherTyped =
        other as DeleteEmployeeWithAccessVariables;
    return id == otherTyped.id &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
        currentEmail == otherTyped.currentEmail;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
    currentEmail.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['currentEmail'] = nativeToJson<String>(currentEmail);
    return json;
  }

  DeleteEmployeeWithAccessVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.currentEmail,
  });
}
