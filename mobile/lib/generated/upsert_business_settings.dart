part of 'example.dart';

class UpsertBusinessSettingsVariablesBuilder {
  String tenantId;
  String businessId;
  String currency;
  String timezone;
  String fiscalYearStart;
  double taxRate;
  int lowStockThreshold;

  final FirebaseDataConnect _dataConnect;
  UpsertBusinessSettingsVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
    required this.currency,
    required this.timezone,
    required this.fiscalYearStart,
    required this.taxRate,
    required this.lowStockThreshold,
  });
  Deserializer<UpsertBusinessSettingsData> dataDeserializer = (dynamic json) =>
      UpsertBusinessSettingsData.fromJson(jsonDecode(json));
  Serializer<UpsertBusinessSettingsVariables> varsSerializer =
      (UpsertBusinessSettingsVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>
  >
  execute() {
    return ref().execute();
  }

  MutationRef<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>
  ref() {
    UpsertBusinessSettingsVariables vars = UpsertBusinessSettingsVariables(
      tenantId: tenantId,
      businessId: businessId,
      currency: currency,
      timezone: timezone,
      fiscalYearStart: fiscalYearStart,
      taxRate: taxRate,
      lowStockThreshold: lowStockThreshold,
    );
    return _dataConnect.mutation(
      "UpsertBusinessSettings",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class UpsertBusinessSettingsBusinessSettingUpsert {
  final String businessId;
  UpsertBusinessSettingsBusinessSettingUpsert.fromJson(dynamic json)
    : businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpsertBusinessSettingsBusinessSettingUpsert otherTyped =
        other as UpsertBusinessSettingsBusinessSettingUpsert;
    return businessId == otherTyped.businessId;
  }

  @override
  int get hashCode => businessId.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  UpsertBusinessSettingsBusinessSettingUpsert({required this.businessId});
}

@immutable
class UpsertBusinessSettingsData {
  final UpsertBusinessSettingsBusinessSettingUpsert businessSetting_upsert;
  UpsertBusinessSettingsData.fromJson(dynamic json)
    : businessSetting_upsert =
          UpsertBusinessSettingsBusinessSettingUpsert.fromJson(
            json['businessSetting_upsert'],
          );
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpsertBusinessSettingsData otherTyped =
        other as UpsertBusinessSettingsData;
    return businessSetting_upsert == otherTyped.businessSetting_upsert;
  }

  @override
  int get hashCode => businessSetting_upsert.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businessSetting_upsert'] = businessSetting_upsert.toJson();
    return json;
  }

  UpsertBusinessSettingsData({required this.businessSetting_upsert});
}

@immutable
class UpsertBusinessSettingsVariables {
  final String tenantId;
  final String businessId;
  final String currency;
  final String timezone;
  final String fiscalYearStart;
  final double taxRate;
  final int lowStockThreshold;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  UpsertBusinessSettingsVariables.fromJson(Map<String, dynamic> json)
    : tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      currency = nativeFromJson<String>(json['currency']),
      timezone = nativeFromJson<String>(json['timezone']),
      fiscalYearStart = nativeFromJson<String>(json['fiscalYearStart']),
      taxRate = nativeFromJson<double>(json['taxRate']),
      lowStockThreshold = nativeFromJson<int>(json['lowStockThreshold']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpsertBusinessSettingsVariables otherTyped =
        other as UpsertBusinessSettingsVariables;
    return tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
        currency == otherTyped.currency &&
        timezone == otherTyped.timezone &&
        fiscalYearStart == otherTyped.fiscalYearStart &&
        taxRate == otherTyped.taxRate &&
        lowStockThreshold == otherTyped.lowStockThreshold;
  }

  @override
  int get hashCode => Object.hashAll([
    tenantId.hashCode,
    businessId.hashCode,
    currency.hashCode,
    timezone.hashCode,
    fiscalYearStart.hashCode,
    taxRate.hashCode,
    lowStockThreshold.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['currency'] = nativeToJson<String>(currency);
    json['timezone'] = nativeToJson<String>(timezone);
    json['fiscalYearStart'] = nativeToJson<String>(fiscalYearStart);
    json['taxRate'] = nativeToJson<double>(taxRate);
    json['lowStockThreshold'] = nativeToJson<int>(lowStockThreshold);
    return json;
  }

  UpsertBusinessSettingsVariables({
    required this.tenantId,
    required this.businessId,
    required this.currency,
    required this.timezone,
    required this.fiscalYearStart,
    required this.taxRate,
    required this.lowStockThreshold,
  });
}
