part of 'example.dart';

class ListProductsByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListProductsByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListProductsByBusinessData> dataDeserializer = (dynamic json)  => ListProductsByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListProductsByBusinessVariables> varsSerializer = (ListProductsByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListProductsByBusinessData, ListProductsByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListProductsByBusinessData, ListProductsByBusinessVariables> ref() {
    ListProductsByBusinessVariables vars= ListProductsByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listProductsByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListProductsByBusinessProducts {
  final String id;
  final String name;
  final String? category;
  final int quantity;
  final double? costPrice;
  final double sellingPrice;
  final DateTime? expiryDate;
  final int? lowStockLevel;
  final String createdBy;
  final Timestamp createdAt;
  final Timestamp? updatedAt;
  final String tenantId;
  final String businessId;
  ListProductsByBusinessProducts.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  name = nativeFromJson<String>(json['name']),
  category = json['category'] == null ? null : nativeFromJson<String>(json['category']),
  quantity = nativeFromJson<int>(json['quantity']),
  costPrice = json['costPrice'] == null ? null : nativeFromJson<double>(json['costPrice']),
  sellingPrice = nativeFromJson<double>(json['sellingPrice']),
  expiryDate = json['expiryDate'] == null ? null : nativeFromJson<DateTime>(json['expiryDate']),
  lowStockLevel = json['lowStockLevel'] == null ? null : nativeFromJson<int>(json['lowStockLevel']),
  createdBy = nativeFromJson<String>(json['createdBy']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  updatedAt = json['updatedAt'] == null ? null : Timestamp.fromJson(json['updatedAt']),
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

    final ListProductsByBusinessProducts otherTyped = other as ListProductsByBusinessProducts;
    return id == otherTyped.id && 
    name == otherTyped.name && 
    category == otherTyped.category && 
    quantity == otherTyped.quantity && 
    costPrice == otherTyped.costPrice && 
    sellingPrice == otherTyped.sellingPrice && 
    expiryDate == otherTyped.expiryDate && 
    lowStockLevel == otherTyped.lowStockLevel && 
    createdBy == otherTyped.createdBy && 
    createdAt == otherTyped.createdAt && 
    updatedAt == otherTyped.updatedAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, name.hashCode, category.hashCode, quantity.hashCode, costPrice.hashCode, sellingPrice.hashCode, expiryDate.hashCode, lowStockLevel.hashCode, createdBy.hashCode, createdAt.hashCode, updatedAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['name'] = nativeToJson<String>(name);
    if (category != null) {
      json['category'] = nativeToJson<String?>(category);
    }
    json['quantity'] = nativeToJson<int>(quantity);
    if (costPrice != null) {
      json['costPrice'] = nativeToJson<double?>(costPrice);
    }
    json['sellingPrice'] = nativeToJson<double>(sellingPrice);
    if (expiryDate != null) {
      json['expiryDate'] = nativeToJson<DateTime?>(expiryDate);
    }
    if (lowStockLevel != null) {
      json['lowStockLevel'] = nativeToJson<int?>(lowStockLevel);
    }
    json['createdBy'] = nativeToJson<String>(createdBy);
    json['createdAt'] = createdAt.toJson();
    if (updatedAt != null) {
      json['updatedAt'] = updatedAt!.toJson();
    }
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListProductsByBusinessProducts({
    required this.id,
    required this.name,
    this.category,
    required this.quantity,
    this.costPrice,
    required this.sellingPrice,
    this.expiryDate,
    this.lowStockLevel,
    required this.createdBy,
    required this.createdAt,
    this.updatedAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListProductsByBusinessData {
  final List<ListProductsByBusinessProducts> products;
  ListProductsByBusinessData.fromJson(dynamic json):
  
  products = (json['products'] as List<dynamic>)
        .map((e) => ListProductsByBusinessProducts.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListProductsByBusinessData otherTyped = other as ListProductsByBusinessData;
    return products == otherTyped.products;
    
  }
  @override
  int get hashCode => products.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['products'] = products.map((e) => e.toJson()).toList();
    return json;
  }

  ListProductsByBusinessData({
    required this.products,
  });
}

@immutable
class ListProductsByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListProductsByBusinessVariables.fromJson(Map<String, dynamic> json):
  
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

    final ListProductsByBusinessVariables otherTyped = other as ListProductsByBusinessVariables;
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

  ListProductsByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

