part of 'example.dart';

class CreateEmployeeWithAccessVariablesBuilder {
  String tenantId;
  String businessId;
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
  String accessCodeHash;

  final FirebaseDataConnect _dataConnect;
  CreateEmployeeWithAccessVariablesBuilder role(String? t) {
    _role.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder salary(double? t) {
    _salary.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder department(String? t) {
    _department.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder contact(String? t) {
    _contact.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder startDate(DateTime? t) {
    _startDate.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder status(String? t) {
    _status.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder attendance(double? t) {
    _attendance.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder salaryPaymentStatus(String? t) {
    _salaryPaymentStatus.value = t;
    return this;
  }

  CreateEmployeeWithAccessVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
    required this.fullName,
    required this.position,
    required this.userRole,
    required this.email,
    required this.accessCodeHash,
  });
  Deserializer<CreateEmployeeWithAccessData> dataDeserializer =
      (dynamic json) => CreateEmployeeWithAccessData.fromJson(jsonDecode(json));
  Serializer<CreateEmployeeWithAccessVariables> varsSerializer =
      (CreateEmployeeWithAccessVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<
      CreateEmployeeWithAccessData,
      CreateEmployeeWithAccessVariables
    >
  >
  execute() {
    return ref().execute();
  }

  MutationRef<CreateEmployeeWithAccessData, CreateEmployeeWithAccessVariables>
  ref() {
    CreateEmployeeWithAccessVariables vars = CreateEmployeeWithAccessVariables(
      tenantId: tenantId,
      businessId: businessId,
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
      accessCodeHash: accessCodeHash,
    );
    return _dataConnect.mutation(
      "CreateEmployeeWithAccess",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class CreateEmployeeWithAccessEmployeeInsert {
  final String id;
  CreateEmployeeWithAccessEmployeeInsert.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeWithAccessEmployeeInsert otherTyped =
        other as CreateEmployeeWithAccessEmployeeInsert;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateEmployeeWithAccessEmployeeInsert({required this.id});
}

@immutable
class CreateEmployeeWithAccessUserInsert {
  final String id;
  CreateEmployeeWithAccessUserInsert.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeWithAccessUserInsert otherTyped =
        other as CreateEmployeeWithAccessUserInsert;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateEmployeeWithAccessUserInsert({required this.id});
}

@immutable
class CreateEmployeeWithAccessData {
  final CreateEmployeeWithAccessEmployeeInsert employee_insert;
  final CreateEmployeeWithAccessUserInsert user_insert;
  CreateEmployeeWithAccessData.fromJson(dynamic json)
    : employee_insert = CreateEmployeeWithAccessEmployeeInsert.fromJson(
        json['employee_insert'],
      ),
      user_insert = CreateEmployeeWithAccessUserInsert.fromJson(
        json['user_insert'],
      );
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final CreateEmployeeWithAccessData otherTyped =
        other as CreateEmployeeWithAccessData;
    return employee_insert == otherTyped.employee_insert &&
        user_insert == otherTyped.user_insert;
  }

  @override
  int get hashCode =>
      Object.hashAll([employee_insert.hashCode, user_insert.hashCode]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['employee_insert'] = employee_insert.toJson();
    json['user_insert'] = user_insert.toJson();
    return json;
  }

  CreateEmployeeWithAccessData({
    required this.employee_insert,
    required this.user_insert,
  });
}

@immutable
class CreateEmployeeWithAccessVariables {
  final String tenantId;
  final String businessId;
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
  final String accessCodeHash;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  CreateEmployeeWithAccessVariables.fromJson(Map<String, dynamic> json)
    : tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      fullName = nativeFromJson<String>(json['fullName']),
      position = nativeFromJson<String>(json['position']),
      userRole = nativeFromJson<String>(json['userRole']),
      email = nativeFromJson<String>(json['email']),
      accessCodeHash = nativeFromJson<String>(json['accessCodeHash']) {
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

    final CreateEmployeeWithAccessVariables otherTyped =
        other as CreateEmployeeWithAccessVariables;
    return tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
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
        salaryPaymentStatus == otherTyped.salaryPaymentStatus &&
        accessCodeHash == otherTyped.accessCodeHash;
  }

  @override
  int get hashCode => Object.hashAll([
    tenantId.hashCode,
    businessId.hashCode,
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
    accessCodeHash.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
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
    json['accessCodeHash'] = nativeToJson<String>(accessCodeHash);
    return json;
  }

  CreateEmployeeWithAccessVariables({
    required this.tenantId,
    required this.businessId,
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
    required this.accessCodeHash,
  });
}
