part of 'example.dart';

class ListSuppliersByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListSuppliersByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListSuppliersByBusinessData> dataDeserializer = (dynamic json)  => ListSuppliersByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListSuppliersByBusinessVariables> varsSerializer = (ListSuppliersByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables> ref() {
    ListSuppliersByBusinessVariables vars= ListSuppliersByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listSuppliersByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListSuppliersByBusinessSuppliers {
  final String id;
  final String supplierName;
  final String? phoneNumber;
  final String? email;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  ListSuppliersByBusinessSuppliers.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  supplierName = nativeFromJson<String>(json['supplierName']),
  phoneNumber = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']),
  email = json['email'] == null ? null : nativeFromJson<String>(json['email']),
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

    final ListSuppliersByBusinessSuppliers otherTyped = other as ListSuppliersByBusinessSuppliers;
    return id == otherTyped.id && 
    supplierName == otherTyped.supplierName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email && 
    createdAt == otherTyped.createdAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, supplierName.hashCode, phoneNumber.hashCode, email.hashCode, createdAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['supplierName'] = nativeToJson<String>(supplierName);
    if (phoneNumber != null) {
      json['phoneNumber'] = nativeToJson<String?>(phoneNumber);
    }
    if (email != null) {
      json['email'] = nativeToJson<String?>(email);
    }
    json['createdAt'] = createdAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListSuppliersByBusinessSuppliers({
    required this.id,
    required this.supplierName,
    this.phoneNumber,
    this.email,
    required this.createdAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListSuppliersByBusinessData {
  final List<ListSuppliersByBusinessSuppliers> suppliers;
  ListSuppliersByBusinessData.fromJson(dynamic json):
  
  suppliers = (json['suppliers'] as List<dynamic>)
        .map((e) => ListSuppliersByBusinessSuppliers.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListSuppliersByBusinessData otherTyped = other as ListSuppliersByBusinessData;
    return suppliers == otherTyped.suppliers;
    
  }
  @override
  int get hashCode => suppliers.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['suppliers'] = suppliers.map((e) => e.toJson()).toList();
    return json;
  }

  ListSuppliersByBusinessData({
    required this.suppliers,
  });
}

@immutable
class ListSuppliersByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListSuppliersByBusinessVariables.fromJson(Map<String, dynamic> json):
  
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

    final ListSuppliersByBusinessVariables otherTyped = other as ListSuppliersByBusinessVariables;
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

  ListSuppliersByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

