part of 'example.dart';

class CreateProductVariablesBuilder {
  String tenantId;
  String businessId;
  String name;
  Optional<String> _category = Optional.optional(nativeFromJson, nativeToJson);
  int quantity;
  Optional<double> _costPrice = Optional.optional(nativeFromJson, nativeToJson);
  double sellingPrice;
  Optional<DateTime> _expiryDate = Optional.optional(nativeFromJson, nativeToJson);
  Optional<int> _lowStockLevel = Optional.optional(nativeFromJson, nativeToJson);
  String createdBy;

  final FirebaseDataConnect _dataConnect;  CreateProductVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  CreateProductVariablesBuilder costPrice(double? t) {
   _costPrice.value = t;
   return this;
  }
  CreateProductVariablesBuilder expiryDate(DateTime? t) {
   _expiryDate.value = t;
   return this;
  }
  CreateProductVariablesBuilder lowStockLevel(int? t) {
   _lowStockLevel.value = t;
   return this;
  }

  CreateProductVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.name,required  this.quantity,required  this.sellingPrice,required  this.createdBy,});
  Deserializer<CreateProductData> dataDeserializer = (dynamic json)  => CreateProductData.fromJson(jsonDecode(json));
  Serializer<CreateProductVariables> varsSerializer = (CreateProductVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateProductData, CreateProductVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateProductData, CreateProductVariables> ref() {
    CreateProductVariables vars= CreateProductVariables(tenantId: tenantId,businessId: businessId,name: name,category: _category,quantity: quantity,costPrice: _costPrice,sellingPrice: sellingPrice,expiryDate: _expiryDate,lowStockLevel: _lowStockLevel,createdBy: createdBy,);
    return _dataConnect.mutation("CreateProduct", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateProductProductInsert {
  final String id;
  CreateProductProductInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateProductProductInsert otherTyped = other as CreateProductProductInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateProductProductInsert({
    required this.id,
  });
}

@immutable
class CreateProductData {
  final CreateProductProductInsert product_insert;
  CreateProductData.fromJson(dynamic json):
  
  product_insert = CreateProductProductInsert.fromJson(json['product_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateProductData otherTyped = other as CreateProductData;
    return product_insert == otherTyped.product_insert;
    
  }
  @override
  int get hashCode => product_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['product_insert'] = product_insert.toJson();
    return json;
  }

  CreateProductData({
    required this.product_insert,
  });
}

@immutable
class CreateProductVariables {
  final String tenantId;
  final String businessId;
  final String name;
  late final Optional<String>category;
  final int quantity;
  late final Optional<double>costPrice;
  final double sellingPrice;
  late final Optional<DateTime>expiryDate;
  late final Optional<int>lowStockLevel;
  final String createdBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateProductVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  name = nativeFromJson<String>(json['name']),
  quantity = nativeFromJson<int>(json['quantity']),
  sellingPrice = nativeFromJson<double>(json['sellingPrice']),
  createdBy = nativeFromJson<String>(json['createdBy']) {
  
  
  
  
  
    category = Optional.optional(nativeFromJson, nativeToJson);
    category.value = json['category'] == null ? null : nativeFromJson<String>(json['category']);
  
  
  
    costPrice = Optional.optional(nativeFromJson, nativeToJson);
    costPrice.value = json['costPrice'] == null ? null : nativeFromJson<double>(json['costPrice']);
  
  
  
    expiryDate = Optional.optional(nativeFromJson, nativeToJson);
    expiryDate.value = json['expiryDate'] == null ? null : nativeFromJson<DateTime>(json['expiryDate']);
  
  
    lowStockLevel = Optional.optional(nativeFromJson, nativeToJson);
    lowStockLevel.value = json['lowStockLevel'] == null ? null : nativeFromJson<int>(json['lowStockLevel']);
  
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateProductVariables otherTyped = other as CreateProductVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    name == otherTyped.name && 
    category == otherTyped.category && 
    quantity == otherTyped.quantity && 
    costPrice == otherTyped.costPrice && 
    sellingPrice == otherTyped.sellingPrice && 
    expiryDate == otherTyped.expiryDate && 
    lowStockLevel == otherTyped.lowStockLevel && 
    createdBy == otherTyped.createdBy;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, name.hashCode, category.hashCode, quantity.hashCode, costPrice.hashCode, sellingPrice.hashCode, expiryDate.hashCode, lowStockLevel.hashCode, createdBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['name'] = nativeToJson<String>(name);
    if(category.state == OptionalState.set) {
      json['category'] = category.toJson();
    }
    json['quantity'] = nativeToJson<int>(quantity);
    if(costPrice.state == OptionalState.set) {
      json['costPrice'] = costPrice.toJson();
    }
    json['sellingPrice'] = nativeToJson<double>(sellingPrice);
    if(expiryDate.state == OptionalState.set) {
      json['expiryDate'] = expiryDate.toJson();
    }
    if(lowStockLevel.state == OptionalState.set) {
      json['lowStockLevel'] = lowStockLevel.toJson();
    }
    json['createdBy'] = nativeToJson<String>(createdBy);
    return json;
  }

  CreateProductVariables({
    required this.tenantId,
    required this.businessId,
    required this.name,
    required this.category,
    required this.quantity,
    required this.costPrice,
    required this.sellingPrice,
    required this.expiryDate,
    required this.lowStockLevel,
    required this.createdBy,
  });
}

