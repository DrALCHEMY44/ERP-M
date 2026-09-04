part of 'example.dart';

class UpdateEmployeeWithAccessVariablesBuilder {
  String id;
  String tenantId;
  String businessId;
  String currentEmail;
  String fullName;
  String position;
  Optional<String> _role = Optional.optional(nativeFromJson, nativeToJson);
  String userRole;
  Optional<double> _salary = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _department = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  String email;
  Optional<String> _contact = Optional.optional(nativeFromJson, nativeToJson);
  Optional<DateTime> _startDate = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  Optional<String> _status = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _attendance = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  Optional<String> _salaryPaymentStatus = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );

  final FirebaseDataConnect _dataConnect;
  UpdateEmployeeWithAccessVariablesBuilder role(String? t) {
    _role.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder salary(double? t) {
    _salary.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder department(String? t) {
    _department.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder contact(String? t) {
    _contact.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder startDate(DateTime? t) {
    _startDate.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder status(String? t) {
    _status.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder attendance(double? t) {
    _attendance.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder salaryPaymentStatus(String? t) {
    _salaryPaymentStatus.value = t;
    return this;
  }

  UpdateEmployeeWithAccessVariablesBuilder(
    this._dataConnect, {
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.currentEmail,
    required this.fullName,
    required this.position,
    required this.userRole,
    required this.email,
  });
  Deserializer<UpdateEmployeeWithAccessData> dataDeserializer =
      (dynamic json) => UpdateEmployeeWithAccessData.fromJson(jsonDecode(json));
  Serializer<UpdateEmployeeWithAccessVariables> varsSerializer =
      (UpdateEmployeeWithAccessVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<
      UpdateEmployeeWithAccessData,
      UpdateEmployeeWithAccessVariables
    >
  >
  execute() {
    return ref().execute();
  }

  MutationRef<UpdateEmployeeWithAccessData, UpdateEmployeeWithAccessVariables>
  ref() {
    UpdateEmployeeWithAccessVariables vars = UpdateEmployeeWithAccessVariables(
      id: id,
      tenantId: tenantId,
      businessId: businessId,
      currentEmail: currentEmail,
      fullName: fullName,
      position: position,
      role: _role,
      userRole: userRole,
      salary: _salary,
      department: _department,
      email: email,
      contact: _contact,
      startDate: _startDate,
      status: _status,
      attendance: _attendance,
      salaryPaymentStatus: _salaryPaymentStatus,
    );
    return _dataConnect.mutation(
      "UpdateEmployeeWithAccess",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class UpdateEmployeeWithAccessEmployeeUpdate {
  final String id;
  UpdateEmployeeWithAccessEmployeeUpdate.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeWithAccessEmployeeUpdate otherTyped =
        other as UpdateEmployeeWithAccessEmployeeUpdate;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateEmployeeWithAccessEmployeeUpdate({required this.id});
}

@immutable
class UpdateEmployeeWithAccessData {
  final UpdateEmployeeWithAccessEmployeeUpdate? employee_update;
  final int user_updateMany;
  UpdateEmployeeWithAccessData.fromJson(dynamic json)
    : employee_update = json['employee_update'] == null
          ? null
          : UpdateEmployeeWithAccessEmployeeUpdate.fromJson(
              json['employee_update'],
            ),
      user_updateMany = nativeFromJson<int>(json['user_updateMany']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeWithAccessData otherTyped =
        other as UpdateEmployeeWithAccessData;
    return employee_update == otherTyped.employee_update &&
        user_updateMany == otherTyped.user_updateMany;
  }

  @override
  int get hashCode =>
      Object.hashAll([employee_update.hashCode, user_updateMany.hashCode]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (employee_update != null) {
      json['employee_update'] = employee_update!.toJson();
    }
    json['user_updateMany'] = nativeToJson<int>(user_updateMany);
    return json;
  }

  UpdateEmployeeWithAccessData({
    this.employee_update,
    required this.user_updateMany,
  });
}

@immutable
class UpdateEmployeeWithAccessVariables {
  final String id;
  final String tenantId;
  final String businessId;
  final String currentEmail;
  final String fullName;
  final String position;
  late final Optional<String> role;
  final String userRole;
  late final Optional<double> salary;
  late final Optional<String> department;
  final String email;
  late final Optional<String> contact;
  late final Optional<DateTime> startDate;
  late final Optional<String> status;
  late final Optional<double> attendance;
  late final Optional<String> salaryPaymentStatus;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  UpdateEmployeeWithAccessVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      currentEmail = nativeFromJson<String>(json['currentEmail']),
      fullName = nativeFromJson<String>(json['fullName']),
      position = nativeFromJson<String>(json['position']),
      userRole = nativeFromJson<String>(json['userRole']),
      email = nativeFromJson<String>(json['email']) {
    role = Optional.optional(nativeFromJson, nativeToJson);
    role.value = json['role'] == null
        ? null
        : nativeFromJson<String>(json['role']);

    salary = Optional.optional(nativeFromJson, nativeToJson);
    salary.value = json['salary'] == null
        ? null
        : nativeFromJson<double>(json['salary']);

    department = Optional.optional(nativeFromJson, nativeToJson);
    department.value = json['department'] == null
        ? null
        : nativeFromJson<String>(json['department']);

    contact = Optional.optional(nativeFromJson, nativeToJson);
    contact.value = json['contact'] == null
        ? null
        : nativeFromJson<String>(json['contact']);

    startDate = Optional.optional(nativeFromJson, nativeToJson);
    startDate.value = json['startDate'] == null
        ? null
        : nativeFromJson<DateTime>(json['startDate']);

    status = Optional.optional(nativeFromJson, nativeToJson);
    status.value = json['status'] == null
        ? null
        : nativeFromJson<String>(json['status']);

    attendance = Optional.optional(nativeFromJson, nativeToJson);
    attendance.value = json['attendance'] == null
        ? null
        : nativeFromJson<double>(json['attendance']);

    salaryPaymentStatus = Optional.optional(nativeFromJson, nativeToJson);
    salaryPaymentStatus.value = json['salaryPaymentStatus'] == null
        ? null
        : nativeFromJson<String>(json['salaryPaymentStatus']);
  }
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateEmployeeWithAccessVariables otherTyped =
        other as UpdateEmployeeWithAccessVariables;
    return id == otherTyped.id &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
        currentEmail == otherTyped.currentEmail &&
        fullName == otherTyped.fullName &&
        position == otherTyped.position &&
        role == otherTyped.role &&
        userRole == otherTyped.userRole &&
        salary == otherTyped.salary &&
        department == otherTyped.department &&
        email == otherTyped.email &&
        contact == otherTyped.contact &&
        startDate == otherTyped.startDate &&
        status == otherTyped.status &&
        attendance == otherTyped.attendance &&
        salaryPaymentStatus == otherTyped.salaryPaymentStatus;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
    currentEmail.hashCode,
    fullName.hashCode,
    position.hashCode,
    role.hashCode,
    userRole.hashCode,
    salary.hashCode,
    department.hashCode,
    email.hashCode,
    contact.hashCode,
    startDate.hashCode,
    status.hashCode,
    attendance.hashCode,
    salaryPaymentStatus.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['currentEmail'] = nativeToJson<String>(currentEmail);
    json['fullName'] = nativeToJson<String>(fullName);
    json['position'] = nativeToJson<String>(position);
    if (role.state == OptionalState.set) {
      json['role'] = role.toJson();
    }
    json['userRole'] = nativeToJson<String>(userRole);
    if (salary.state == OptionalState.set) {
      json['salary'] = salary.toJson();
    }
    if (department.state == OptionalState.set) {
      json['department'] = department.toJson();
    }
    json['email'] = nativeToJson<String>(email);
    if (contact.state == OptionalState.set) {
      json['contact'] = contact.toJson();
    }
    if (startDate.state == OptionalState.set) {
      json['startDate'] = startDate.toJson();
    }
    if (status.state == OptionalState.set) {
      json['status'] = status.toJson();
    }
    if (attendance.state == OptionalState.set) {
      json['attendance'] = attendance.toJson();
    }
    if (salaryPaymentStatus.state == OptionalState.set) {
      json['salaryPaymentStatus'] = salaryPaymentStatus.toJson();
    }
    return json;
  }

  UpdateEmployeeWithAccessVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.currentEmail,
    required this.fullName,
    required this.position,
    required this.role,
    required this.userRole,
    required this.salary,
    required this.department,
    required this.email,
    required this.contact,
    required this.startDate,
    required this.status,
    required this.attendance,
    required this.salaryPaymentStatus,
  });
}
