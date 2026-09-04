part of 'example.dart';

class GetCustomerForCompanyVariablesBuilder {
  String id;
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  GetCustomerForCompanyVariablesBuilder(
    this._dataConnect, {
    required this.id,
    required this.tenantId,
    required this.businessId,
  });
  Deserializer<GetCustomerForCompanyData> dataDeserializer = (dynamic json) =>
      GetCustomerForCompanyData.fromJson(jsonDecode(json));
  Serializer<GetCustomerForCompanyVariables> varsSerializer =
      (GetCustomerForCompanyVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetCustomerForCompanyData, GetCustomerForCompanyVariables>>
  execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetCustomerForCompanyData, GetCustomerForCompanyVariables> ref() {
    GetCustomerForCompanyVariables vars = GetCustomerForCompanyVariables(
      id: id,
      tenantId: tenantId,
      businessId: businessId,
    );
    return _dataConnect.query(
      "getCustomerForCompany",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class GetCustomerForCompanyCustomer {
  final String id;
  GetCustomerForCompanyCustomer.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetCustomerForCompanyCustomer otherTyped =
        other as GetCustomerForCompanyCustomer;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  GetCustomerForCompanyCustomer({required this.id});
}

@immutable
class GetCustomerForCompanyData {
  final GetCustomerForCompanyCustomer? customer;
  GetCustomerForCompanyData.fromJson(dynamic json)
    : customer = json['customer'] == null
          ? null
          : GetCustomerForCompanyCustomer.fromJson(json['customer']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final GetCustomerForCompanyData otherTyped =
        other as GetCustomerForCompanyData;
    return customer == otherTyped.customer;
  }

  @override
  int get hashCode => customer.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (customer != null) {
      json['customer'] = customer!.toJson();
    }
    return json;
  }

  GetCustomerForCompanyData({this.customer});
}

@immutable
class GetCustomerForCompanyVariables {
  final String id;
  final String tenantId;
  final String businessId;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  GetCustomerForCompanyVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']),
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

    final GetCustomerForCompanyVariables otherTyped =
        other as GetCustomerForCompanyVariables;
    return id == otherTyped.id &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId;
  }

  @override
  int get hashCode =>
      Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  GetCustomerForCompanyVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
  });
}
