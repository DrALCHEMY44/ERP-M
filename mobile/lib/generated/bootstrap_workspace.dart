part of 'example.dart';

class BootstrapWorkspaceVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;
  String name;
  String businessSector;
  String location;
  String region;
  String ownerEmail;
  String fullName;
  String code;

  final FirebaseDataConnect _dataConnect;
  BootstrapWorkspaceVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.name,
    required this.businessSector,
    required this.location,
    required this.region,
    required this.ownerEmail,
    required this.fullName,
    required this.code,
  });
  Deserializer<BootstrapWorkspaceData> dataDeserializer = (dynamic json) =>
      BootstrapWorkspaceData.fromJson(jsonDecode(json));
  Serializer<BootstrapWorkspaceVariables> varsSerializer =
      (BootstrapWorkspaceVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<BootstrapWorkspaceData, BootstrapWorkspaceVariables>>
  execute() {
    return ref().execute();
  }

  MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables> ref() {
    BootstrapWorkspaceVariables vars = BootstrapWorkspaceVariables(
      tenantId: tenantId,
      businessId: businessId,
      userId: userId,
      name: name,
      businessSector: businessSector,
      location: location,
      region: region,
      ownerEmail: ownerEmail,
      fullName: fullName,
      code: code,
    );
    return _dataConnect.mutation(
      "BootstrapWorkspace",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class BootstrapWorkspaceTenantInsert {
  final String id;
  BootstrapWorkspaceTenantInsert.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceTenantInsert otherTyped =
        other as BootstrapWorkspaceTenantInsert;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  BootstrapWorkspaceTenantInsert({required this.id});
}

@immutable
class BootstrapWorkspaceBusinessInsert {
  final String id;
  BootstrapWorkspaceBusinessInsert.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceBusinessInsert otherTyped =
        other as BootstrapWorkspaceBusinessInsert;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  BootstrapWorkspaceBusinessInsert({required this.id});
}

@immutable
class BootstrapWorkspaceBusinessSettingInsert {
  final String businessId;
  BootstrapWorkspaceBusinessSettingInsert.fromJson(dynamic json)
    : businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceBusinessSettingInsert otherTyped =
        other as BootstrapWorkspaceBusinessSettingInsert;
    return businessId == otherTyped.businessId;
  }

  @override
  int get hashCode => businessId.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  BootstrapWorkspaceBusinessSettingInsert({required this.businessId});
}

@immutable
class BootstrapWorkspaceUserInsert {
  final String id;
  BootstrapWorkspaceUserInsert.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceUserInsert otherTyped =
        other as BootstrapWorkspaceUserInsert;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  BootstrapWorkspaceUserInsert({required this.id});
}

@immutable
class BootstrapWorkspaceData {
  final BootstrapWorkspaceTenantInsert tenant_insert;
  final BootstrapWorkspaceBusinessInsert business_insert;
  final BootstrapWorkspaceBusinessSettingInsert businessSetting_insert;
  final BootstrapWorkspaceUserInsert user_insert;
  BootstrapWorkspaceData.fromJson(dynamic json)
    : tenant_insert = BootstrapWorkspaceTenantInsert.fromJson(
        json['tenant_insert'],
      ),
      business_insert = BootstrapWorkspaceBusinessInsert.fromJson(
        json['business_insert'],
      ),
      businessSetting_insert = BootstrapWorkspaceBusinessSettingInsert.fromJson(
        json['businessSetting_insert'],
      ),
      user_insert = BootstrapWorkspaceUserInsert.fromJson(json['user_insert']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceData otherTyped = other as BootstrapWorkspaceData;
    return tenant_insert == otherTyped.tenant_insert &&
        business_insert == otherTyped.business_insert &&
        businessSetting_insert == otherTyped.businessSetting_insert &&
        user_insert == otherTyped.user_insert;
  }

  @override
  int get hashCode => Object.hashAll([
    tenant_insert.hashCode,
    business_insert.hashCode,
    businessSetting_insert.hashCode,
    user_insert.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenant_insert'] = tenant_insert.toJson();
    json['business_insert'] = business_insert.toJson();
    json['businessSetting_insert'] = businessSetting_insert.toJson();
    json['user_insert'] = user_insert.toJson();
    return json;
  }

  BootstrapWorkspaceData({
    required this.tenant_insert,
    required this.business_insert,
    required this.businessSetting_insert,
    required this.user_insert,
  });
}

@immutable
class BootstrapWorkspaceVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  final String name;
  final String businessSector;
  final String location;
  final String region;
  final String ownerEmail;
  final String fullName;
  final String code;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  BootstrapWorkspaceVariables.fromJson(Map<String, dynamic> json)
    : tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      userId = nativeFromJson<String>(json['userId']),
      name = nativeFromJson<String>(json['name']),
      businessSector = nativeFromJson<String>(json['businessSector']),
      location = nativeFromJson<String>(json['location']),
      region = nativeFromJson<String>(json['region']),
      ownerEmail = nativeFromJson<String>(json['ownerEmail']),
      fullName = nativeFromJson<String>(json['fullName']),
      code = nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final BootstrapWorkspaceVariables otherTyped =
        other as BootstrapWorkspaceVariables;
    return tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
        userId == otherTyped.userId &&
        name == otherTyped.name &&
        businessSector == otherTyped.businessSector &&
        location == otherTyped.location &&
        region == otherTyped.region &&
        ownerEmail == otherTyped.ownerEmail &&
        fullName == otherTyped.fullName &&
        code == otherTyped.code;
  }

  @override
  int get hashCode => Object.hashAll([
    tenantId.hashCode,
    businessId.hashCode,
    userId.hashCode,
    name.hashCode,
    businessSector.hashCode,
    location.hashCode,
    region.hashCode,
    ownerEmail.hashCode,
    fullName.hashCode,
    code.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['name'] = nativeToJson<String>(name);
    json['businessSector'] = nativeToJson<String>(businessSector);
    json['location'] = nativeToJson<String>(location);
    json['region'] = nativeToJson<String>(region);
    json['ownerEmail'] = nativeToJson<String>(ownerEmail);
    json['fullName'] = nativeToJson<String>(fullName);
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  BootstrapWorkspaceVariables({
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.name,
    required this.businessSector,
    required this.location,
    required this.region,
    required this.ownerEmail,
    required this.fullName,
    required this.code,
  });
}
