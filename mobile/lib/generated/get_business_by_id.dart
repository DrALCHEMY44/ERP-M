part of 'example.dart';

class GetBusinessByIdVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  GetBusinessByIdVariablesBuilder(this._dataConnect, {required this.id});
  Deserializer<GetBusinessByIdData> dataDeserializer = (dynamic json) =>
      GetBusinessByIdData.fromJson(jsonDecode(json));
  Serializer<GetBusinessByIdVariables> varsSerializer =
      (GetBusinessByIdVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetBusinessByIdData, GetBusinessByIdVariables>> execute({
    QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache,
  }) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetBusinessByIdData, GetBusinessByIdVariables> ref() {
    GetBusinessByIdVariables vars = GetBusinessByIdVariables(id: id);
    return _dataConnect.query(
      "getBusinessById",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class GetBusinessByIdBusiness {
  final String id;
  final String tenantId;
  final String name;
  final String location;
  final String? businessType;
  final String? entityType;
  final String? city;
  final String? region;
  final String? phone;
  final String? email;
  final String? taxId;
  final String? description;
  final String? logoUrl;
  final Timestamp createdAt;
  final String code;
  GetBusinessByIdBusiness.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      name = nativeFromJson<String>(json['name']),
      location = nativeFromJson<String>(json['location']),
      businessType = json['businessType'] == null
          ? null
          : nativeFromJson<String>(json['businessType']),
      entityType = json['entityType'] == null
          ? null
          : nativeFromJson<String>(json['entityType']),
      city = json['city'] == null ? null : nativeFromJson<String>(json['city']),
      region = json['region'] == null
          ? null
          : nativeFromJson<String>(json['region']),
      phone = json['phone'] == null
          ? null
          : nativeFromJson<String>(json['phone']),
      email = json['email'] == null
          ? null
          : nativeFromJson<String>(json['email']),
      taxId = json['taxId'] == null
          ? null
          : nativeFromJson<String>(json['taxId']),
      description = json['description'] == null
          ? null
          : nativeFromJson<String>(json['description']),
      logoUrl = json['logoUrl'] == null
          ? null
          : nativeFromJson<String>(json['logoUrl']),
      createdAt = Timestamp.fromJson(json['createdAt']),
      code = nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdBusiness otherTyped = other as GetBusinessByIdBusiness;
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
        createdAt == otherTyped.createdAt &&
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
    createdAt.hashCode,
    code.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['name'] = nativeToJson<String>(name);
    json['location'] = nativeToJson<String>(location);
    if (businessType != null) {
      json['businessType'] = nativeToJson<String?>(businessType);
    }
    if (entityType != null) {
      json['entityType'] = nativeToJson<String?>(entityType);
    }
    if (city != null) {
      json['city'] = nativeToJson<String?>(city);
    }
    if (region != null) {
      json['region'] = nativeToJson<String?>(region);
    }
    if (phone != null) {
      json['phone'] = nativeToJson<String?>(phone);
    }
    if (email != null) {
      json['email'] = nativeToJson<String?>(email);
    }
    if (taxId != null) {
      json['taxId'] = nativeToJson<String?>(taxId);
    }
    if (description != null) {
      json['description'] = nativeToJson<String?>(description);
    }
    if (logoUrl != null) {
      json['logoUrl'] = nativeToJson<String?>(logoUrl);
    }
    json['createdAt'] = createdAt.toJson();
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  GetBusinessByIdBusiness({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.location,
    this.businessType,
    this.entityType,
    this.city,
    this.region,
    this.phone,
    this.email,
    this.taxId,
    this.description,
    this.logoUrl,
    required this.createdAt,
    required this.code,
  });
}

@immutable
class GetBusinessByIdData {
  final GetBusinessByIdBusiness? business;
  GetBusinessByIdData.fromJson(dynamic json)
    : business = json['business'] == null
          ? null
          : GetBusinessByIdBusiness.fromJson(json['business']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdData otherTyped = other as GetBusinessByIdData;
    return business == otherTyped.business;
  }

  @override
  int get hashCode => business.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (business != null) {
      json['business'] = business!.toJson();
    }
    return json;
  }

  GetBusinessByIdData({this.business});
}

@immutable
class GetBusinessByIdVariables {
  final String id;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  GetBusinessByIdVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdVariables otherTyped =
        other as GetBusinessByIdVariables;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  GetBusinessByIdVariables({required this.id});
}
