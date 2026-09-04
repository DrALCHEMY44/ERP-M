part of 'example.dart';

class GetBusinessSettingsVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  GetBusinessSettingsVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
  });
  Deserializer<GetBusinessSettingsData> dataDeserializer = (dynamic json) =>
      GetBusinessSettingsData.fromJson(jsonDecode(json));
  Serializer<GetBusinessSettingsVariables> varsSerializer =
      (GetBusinessSettingsVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetBusinessSettingsData, GetBusinessSettingsVariables>>
  execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetBusinessSettingsData, GetBusinessSettingsVariables> ref() {
    GetBusinessSettingsVariables vars = GetBusinessSettingsVariables(
      tenantId: tenantId,
      businessId: businessId,
    );
    return _dataConnect.query(
      "getBusinessSettings",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class GetBusinessSettingsBusinessSettings {
  final String businessId;
  final String tenantId;
  final String currency;
  final String timezone;
  final String fiscalYearStart;
  final double taxRate;
  final int lowStockThreshold;
  final Timestamp updatedAt;
  GetBusinessSettingsBusinessSettings.fromJson(dynamic json)
    : businessId = nativeFromJson<String>(json['businessId']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      currency = nativeFromJson<String>(json['currency']),
      timezone = nativeFromJson<String>(json['timezone']),
      fiscalYearStart = nativeFromJson<String>(json['fiscalYearStart']),
      taxRate = nativeFromJson<double>(json['taxRate']),
      lowStockThreshold = nativeFromJson<int>(json['lowStockThreshold']),
      updatedAt = Timestamp.fromJson(json['updatedAt']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessSettingsBusinessSettings otherTyped =
        other as GetBusinessSettingsBusinessSettings;
    return businessId == otherTyped.businessId &&
        tenantId == otherTyped.tenantId &&
        currency == otherTyped.currency &&
        timezone == otherTyped.timezone &&
        fiscalYearStart == otherTyped.fiscalYearStart &&
        taxRate == otherTyped.taxRate &&
        lowStockThreshold == otherTyped.lowStockThreshold &&
        updatedAt == otherTyped.updatedAt;
  }

  @override
  int get hashCode => Object.hashAll([
    businessId.hashCode,
    tenantId.hashCode,
    currency.hashCode,
    timezone.hashCode,
    fiscalYearStart.hashCode,
    taxRate.hashCode,
    lowStockThreshold.hashCode,
    updatedAt.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businessId'] = nativeToJson<String>(businessId);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['currency'] = nativeToJson<String>(currency);
    json['timezone'] = nativeToJson<String>(timezone);
    json['fiscalYearStart'] = nativeToJson<String>(fiscalYearStart);
    json['taxRate'] = nativeToJson<double>(taxRate);
    json['lowStockThreshold'] = nativeToJson<int>(lowStockThreshold);
    json['updatedAt'] = updatedAt.toJson();
    return json;
  }

  GetBusinessSettingsBusinessSettings({
    required this.businessId,
    required this.tenantId,
    required this.currency,
    required this.timezone,
    required this.fiscalYearStart,
    required this.taxRate,
    required this.lowStockThreshold,
    required this.updatedAt,
  });
}

@immutable
class GetBusinessSettingsData {
  final List<GetBusinessSettingsBusinessSettings> businessSettings;
  GetBusinessSettingsData.fromJson(dynamic json)
    : businessSettings = (json['businessSettings'] as List<dynamic>)
          .map((e) => GetBusinessSettingsBusinessSettings.fromJson(e))
          .toList();
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessSettingsData otherTyped = other as GetBusinessSettingsData;
    return businessSettings == otherTyped.businessSettings;
  }

  @override
  int get hashCode => businessSettings.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businessSettings'] = businessSettings.map((e) => e.toJson()).toList();
    return json;
  }

  GetBusinessSettingsData({required this.businessSettings});
}

@immutable
class GetBusinessSettingsVariables {
  final String tenantId;
  final String businessId;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  GetBusinessSettingsVariables.fromJson(Map<String, dynamic> json)
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

    final GetBusinessSettingsVariables otherTyped =
        other as GetBusinessSettingsVariables;
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

  GetBusinessSettingsVariables({
    required this.tenantId,
    required this.businessId,
  });
}
