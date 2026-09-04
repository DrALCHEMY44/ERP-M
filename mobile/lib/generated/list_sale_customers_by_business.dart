part of 'example.dart';

class ListSaleCustomersByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListSaleCustomersByBusinessVariablesBuilder(
    this._dataConnect, {
    required this.tenantId,
    required this.businessId,
  });
  Deserializer<ListSaleCustomersByBusinessData> dataDeserializer =
      (dynamic json) =>
          ListSaleCustomersByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListSaleCustomersByBusinessVariables> varsSerializer =
      (ListSaleCustomersByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<
    QueryResult<
      ListSaleCustomersByBusinessData,
      ListSaleCustomersByBusinessVariables
    >
  >
  execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<
    ListSaleCustomersByBusinessData,
    ListSaleCustomersByBusinessVariables
  >
  ref() {
    ListSaleCustomersByBusinessVariables vars =
        ListSaleCustomersByBusinessVariables(
          tenantId: tenantId,
          businessId: businessId,
        );
    return _dataConnect.query(
      "listSaleCustomersByBusiness",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class ListSaleCustomersByBusinessCustomers {
  final String id;
  final String customerName;
  final String tenantId;
  final String businessId;
  ListSaleCustomersByBusinessCustomers.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']),
      customerName = nativeFromJson<String>(json['customerName']),
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

    final ListSaleCustomersByBusinessCustomers otherTyped =
        other as ListSaleCustomersByBusinessCustomers;
    return id == otherTyped.id &&
        customerName == otherTyped.customerName &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    customerName.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['customerName'] = nativeToJson<String>(customerName);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListSaleCustomersByBusinessCustomers({
    required this.id,
    required this.customerName,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListSaleCustomersByBusinessData {
  final List<ListSaleCustomersByBusinessCustomers> customers;
  ListSaleCustomersByBusinessData.fromJson(dynamic json)
    : customers = (json['customers'] as List<dynamic>)
          .map((e) => ListSaleCustomersByBusinessCustomers.fromJson(e))
          .toList();
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListSaleCustomersByBusinessData otherTyped =
        other as ListSaleCustomersByBusinessData;
    return customers == otherTyped.customers;
  }

  @override
  int get hashCode => customers.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['customers'] = customers.map((e) => e.toJson()).toList();
    return json;
  }

  ListSaleCustomersByBusinessData({required this.customers});
}

@immutable
class ListSaleCustomersByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  ListSaleCustomersByBusinessVariables.fromJson(Map<String, dynamic> json)
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

    final ListSaleCustomersByBusinessVariables otherTyped =
        other as ListSaleCustomersByBusinessVariables;
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

  ListSaleCustomersByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}
