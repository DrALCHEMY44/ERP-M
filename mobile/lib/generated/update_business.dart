part of 'example.dart';

class UpdateBusinessVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _name = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _location = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessType = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  Optional<String> _entityType = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  Optional<String> _city = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _region = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phone = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _taxId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _description = Optional.optional(
    nativeFromJson,
    nativeToJson,
  );
  Optional<String> _logoUrl = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _code = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;
  UpdateBusinessVariablesBuilder tenantId(String? t) {
    _tenantId.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder name(String? t) {
    _name.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder location(String? t) {
    _location.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder businessType(String? t) {
    _businessType.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder entityType(String? t) {
    _entityType.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder city(String? t) {
    _city.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder region(String? t) {
    _region.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder phone(String? t) {
    _phone.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder email(String? t) {
    _email.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder taxId(String? t) {
    _taxId.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder description(String? t) {
    _description.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder logoUrl(String? t) {
    _logoUrl.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder code(String? t) {
    _code.value = t;
    return this;
  }

  UpdateBusinessVariablesBuilder(this._dataConnect, {required this.id});
  Deserializer<UpdateBusinessData> dataDeserializer = (dynamic json) =>
      UpdateBusinessData.fromJson(jsonDecode(json));
  Serializer<UpdateBusinessVariables> varsSerializer =
      (UpdateBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateBusinessData, UpdateBusinessVariables>>
  execute() {
    return ref().execute();
  }

  MutationRef<UpdateBusinessData, UpdateBusinessVariables> ref() {
    UpdateBusinessVariables vars = UpdateBusinessVariables(
      id: id,
      tenantId: _tenantId,
      name: _name,
      location: _location,
      businessType: _businessType,
      entityType: _entityType,
      city: _city,
      region: _region,
      phone: _phone,
      email: _email,
      taxId: _taxId,
      description: _description,
      logoUrl: _logoUrl,
      code: _code,
    );
    return _dataConnect.mutation(
      "UpdateBusiness",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class UpdateBusinessBusinessUpdate {
  final String id;
  UpdateBusinessBusinessUpdate.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessBusinessUpdate otherTyped =
        other as UpdateBusinessBusinessUpdate;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateBusinessBusinessUpdate({required this.id});
}

@immutable
class UpdateBusinessData {
  final UpdateBusinessBusinessUpdate? business_update;
  UpdateBusinessData.fromJson(dynamic json)
    : business_update = json['business_update'] == null
          ? null
          : UpdateBusinessBusinessUpdate.fromJson(json['business_update']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessData otherTyped = other as UpdateBusinessData;
    return business_update == otherTyped.business_update;
  }

  @override
  int get hashCode => business_update.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (business_update != null) {
      json['business_update'] = business_update!.toJson();
    }
    return json;
  }

  UpdateBusinessData({this.business_update});
}

@immutable
class UpdateBusinessVariables {
  final String id;
  late final Optional<String> tenantId;
  late final Optional<String> name;
  late final Optional<String> location;
  late final Optional<String> businessType;
  late final Optional<String> entityType;
  late final Optional<String> city;
  late final Optional<String> region;
  late final Optional<String> phone;
  late final Optional<String> email;
  late final Optional<String> taxId;
  late final Optional<String> description;
  late final Optional<String> logoUrl;
  late final Optional<String> code;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  UpdateBusinessVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']) {
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null
        ? null
        : nativeFromJson<String>(json['tenantId']);

    name = Optional.optional(nativeFromJson, nativeToJson);
    name.value = json['name'] == null
        ? null
        : nativeFromJson<String>(json['name']);

    location = Optional.optional(nativeFromJson, nativeToJson);
    location.value = json['location'] == null
        ? null
        : nativeFromJson<String>(json['location']);

    businessType = Optional.optional(nativeFromJson, nativeToJson);
    businessType.value = json['businessType'] == null
        ? null
        : nativeFromJson<String>(json['businessType']);

    entityType = Optional.optional(nativeFromJson, nativeToJson);
    entityType.value = json['entityType'] == null
        ? null
        : nativeFromJson<String>(json['entityType']);

    city = Optional.optional(nativeFromJson, nativeToJson);
    city.value = json['city'] == null
        ? null
        : nativeFromJson<String>(json['city']);

    region = Optional.optional(nativeFromJson, nativeToJson);
    region.value = json['region'] == null
        ? null
        : nativeFromJson<String>(json['region']);

    phone = Optional.optional(nativeFromJson, nativeToJson);
    phone.value = json['phone'] == null
        ? null
        : nativeFromJson<String>(json['phone']);

    email = Optional.optional(nativeFromJson, nativeToJson);
    email.value = json['email'] == null
        ? null
        : nativeFromJson<String>(json['email']);

    taxId = Optional.optional(nativeFromJson, nativeToJson);
    taxId.value = json['taxId'] == null
        ? null
        : nativeFromJson<String>(json['taxId']);

    description = Optional.optional(nativeFromJson, nativeToJson);
    description.value = json['description'] == null
        ? null
        : nativeFromJson<String>(json['description']);

    logoUrl = Optional.optional(nativeFromJson, nativeToJson);
    logoUrl.value = json['logoUrl'] == null
        ? null
        : nativeFromJson<String>(json['logoUrl']);

    code = Optional.optional(nativeFromJson, nativeToJson);
    code.value = json['code'] == null
        ? null
        : nativeFromJson<String>(json['code']);
  }
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessVariables otherTyped = other as UpdateBusinessVariables;
    return id == otherTyped.id &&
        tenantId == otherTyped.tenantId &&
        name == otherTyped.name &&
        location == otherTyped.location &&
        businessType == otherTyped.businessType &&
        entityType == otherTyped.entityType &&
        city == otherTyped.city &&
        region == otherTyped.region &&
        phone == otherTyped.phone &&
        email == otherTyped.email &&
        taxId == otherTyped.taxId &&
        description == otherTyped.description &&
        logoUrl == otherTyped.logoUrl &&
        code == otherTyped.code;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    tenantId.hashCode,
    name.hashCode,
    location.hashCode,
    businessType.hashCode,
    entityType.hashCode,
    city.hashCode,
    region.hashCode,
    phone.hashCode,
    email.hashCode,
    taxId.hashCode,
    description.hashCode,
    logoUrl.hashCode,
    code.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if (tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if (name.state == OptionalState.set) {
      json['name'] = name.toJson();
    }
    if (location.state == OptionalState.set) {
      json['location'] = location.toJson();
    }
    if (businessType.state == OptionalState.set) {
      json['businessType'] = businessType.toJson();
    }
    if (entityType.state == OptionalState.set) {
      json['entityType'] = entityType.toJson();
    }
    if (city.state == OptionalState.set) {
      json['city'] = city.toJson();
    }
    if (region.state == OptionalState.set) {
      json['region'] = region.toJson();
    }
    if (phone.state == OptionalState.set) {
      json['phone'] = phone.toJson();
    }
    if (email.state == OptionalState.set) {
      json['email'] = email.toJson();
    }
    if (taxId.state == OptionalState.set) {
      json['taxId'] = taxId.toJson();
    }
    if (description.state == OptionalState.set) {
      json['description'] = description.toJson();
    }
    if (logoUrl.state == OptionalState.set) {
      json['logoUrl'] = logoUrl.toJson();
    }
    if (code.state == OptionalState.set) {
      json['code'] = code.toJson();
    }
    return json;
  }

  UpdateBusinessVariables({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.location,
    required this.businessType,
    required this.entityType,
    required this.city,
    required this.region,
    required this.phone,
    required this.email,
    required this.taxId,
    required this.description,
    required this.logoUrl,
    required this.code,
  });
}
