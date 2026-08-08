part of 'example.dart';

class ListCustomersByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListCustomersByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListCustomersByBusinessData> dataDeserializer = (dynamic json)  => ListCustomersByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListCustomersByBusinessVariables> varsSerializer = (ListCustomersByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListCustomersByBusinessData, ListCustomersByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListCustomersByBusinessData, ListCustomersByBusinessVariables> ref() {
    ListCustomersByBusinessVariables vars= ListCustomersByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listCustomersByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListCustomersByBusinessCustomers {
  final String id;
  final String customerName;
  final String? phoneNumber;
  final String? email;
  final String? location;
  final int? totalOrders;
  final double? totalSpent;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  ListCustomersByBusinessCustomers.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  customerName = nativeFromJson<String>(json['customerName']),
  phoneNumber = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']),
  email = json['email'] == null ? null : nativeFromJson<String>(json['email']),
  location = json['location'] == null ? null : nativeFromJson<String>(json['location']),
  totalOrders = json['totalOrders'] == null ? null : nativeFromJson<int>(json['totalOrders']),
  totalSpent = json['totalSpent'] == null ? null : nativeFromJson<double>(json['totalSpent']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListCustomersByBusinessCustomers otherTyped = other as ListCustomersByBusinessCustomers;
    return id == otherTyped.id && 
    customerName == otherTyped.customerName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email && 
    location == otherTyped.location && 
    totalOrders == otherTyped.totalOrders && 
    totalSpent == otherTyped.totalSpent && 
    createdAt == otherTyped.createdAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, customerName.hashCode, phoneNumber.hashCode, email.hashCode, location.hashCode, totalOrders.hashCode, totalSpent.hashCode, createdAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['customerName'] = nativeToJson<String>(customerName);
    if (phoneNumber != null) {
      json['phoneNumber'] = nativeToJson<String?>(phoneNumber);
    }
    if (email != null) {
      json['email'] = nativeToJson<String?>(email);
    }
    if (location != null) {
      json['location'] = nativeToJson<String?>(location);
    }
    if (totalOrders != null) {
      json['totalOrders'] = nativeToJson<int?>(totalOrders);
    }
    if (totalSpent != null) {
      json['totalSpent'] = nativeToJson<double?>(totalSpent);
    }
    json['createdAt'] = createdAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListCustomersByBusinessCustomers({
    required this.id,
    required this.customerName,
    this.phoneNumber,
    this.email,
    this.location,
    this.totalOrders,
    this.totalSpent,
    required this.createdAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListCustomersByBusinessData {
  final List<ListCustomersByBusinessCustomers> customers;
  ListCustomersByBusinessData.fromJson(dynamic json):
  
  customers = (json['customers'] as List<dynamic>)
        .map((e) => ListCustomersByBusinessCustomers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListCustomersByBusinessData otherTyped = other as ListCustomersByBusinessData;
    return customers == otherTyped.customers;
    
  }
  @override
  int get hashCode => customers.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['customers'] = customers.map((e) => e.toJson()).toList();
    return json;
  }

  ListCustomersByBusinessData({
    required this.customers,
  });
}

@immutable
class ListCustomersByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListCustomersByBusinessVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListCustomersByBusinessVariables otherTyped = other as ListCustomersByBusinessVariables;
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

  ListCustomersByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

