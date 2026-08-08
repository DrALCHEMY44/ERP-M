part of 'example.dart';

class UpdateProductVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _name = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _category = Optional.optional(nativeFromJson, nativeToJson);
  Optional<int> _quantity = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _costPrice = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _sellingPrice = Optional.optional(nativeFromJson, nativeToJson);
  Optional<DateTime> _expiryDate = Optional.optional(nativeFromJson, nativeToJson);
  Optional<int> _lowStockLevel = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _createdBy = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateProductVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateProductVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateProductVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateProductVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  UpdateProductVariablesBuilder quantity(int? t) {
   _quantity.value = t;
   return this;
  }
  UpdateProductVariablesBuilder costPrice(double? t) {
   _costPrice.value = t;
   return this;
  }
  UpdateProductVariablesBuilder sellingPrice(double? t) {
   _sellingPrice.value = t;
   return this;
  }
  UpdateProductVariablesBuilder expiryDate(DateTime? t) {
   _expiryDate.value = t;
   return this;
  }
  UpdateProductVariablesBuilder lowStockLevel(int? t) {
   _lowStockLevel.value = t;
   return this;
  }
  UpdateProductVariablesBuilder createdBy(String? t) {
   _createdBy.value = t;
   return this;
  }

  UpdateProductVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateProductData> dataDeserializer = (dynamic json)  => UpdateProductData.fromJson(jsonDecode(json));
  Serializer<UpdateProductVariables> varsSerializer = (UpdateProductVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateProductData, UpdateProductVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateProductData, UpdateProductVariables> ref() {
    UpdateProductVariables vars= UpdateProductVariables(id: id,tenantId: _tenantId,businessId: _businessId,name: _name,category: _category,quantity: _quantity,costPrice: _costPrice,sellingPrice: _sellingPrice,expiryDate: _expiryDate,lowStockLevel: _lowStockLevel,createdBy: _createdBy,);
    return _dataConnect.mutation("UpdateProduct", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateProductProductUpdate {
  final String id;
  UpdateProductProductUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateProductProductUpdate otherTyped = other as UpdateProductProductUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateProductProductUpdate({
    required this.id,
  });
}

@immutable
class UpdateProductData {
  final UpdateProductProductUpdate? product_update;
  UpdateProductData.fromJson(dynamic json):
  
  product_update = json['product_update'] == null ? null : UpdateProductProductUpdate.fromJson(json['product_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateProductData otherTyped = other as UpdateProductData;
    return product_update == otherTyped.product_update;
    
  }
  @override
  int get hashCode => product_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (product_update != null) {
      json['product_update'] = product_update!.toJson();
    }
    return json;
  }

  UpdateProductData({
    this.product_update,
  });
}

@immutable
class UpdateProductVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>name;
  late final Optional<String>category;
  late final Optional<int>quantity;
  late final Optional<double>costPrice;
  late final Optional<double>sellingPrice;
  late final Optional<DateTime>expiryDate;
  late final Optional<int>lowStockLevel;
  late final Optional<String>createdBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateProductVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    name = Optional.optional(nativeFromJson, nativeToJson);
    name.value = json['name'] == null ? null : nativeFromJson<String>(json['name']);
  
  
    category = Optional.optional(nativeFromJson, nativeToJson);
    category.value = json['category'] == null ? null : nativeFromJson<String>(json['category']);
  
  
    quantity = Optional.optional(nativeFromJson, nativeToJson);
    quantity.value = json['quantity'] == null ? null : nativeFromJson<int>(json['quantity']);
  
  
    costPrice = Optional.optional(nativeFromJson, nativeToJson);
    costPrice.value = json['costPrice'] == null ? null : nativeFromJson<double>(json['costPrice']);
  
  
    sellingPrice = Optional.optional(nativeFromJson, nativeToJson);
    sellingPrice.value = json['sellingPrice'] == null ? null : nativeFromJson<double>(json['sellingPrice']);
  
  
    expiryDate = Optional.optional(nativeFromJson, nativeToJson);
    expiryDate.value = json['expiryDate'] == null ? null : nativeFromJson<DateTime>(json['expiryDate']);
  
  
    lowStockLevel = Optional.optional(nativeFromJson, nativeToJson);
    lowStockLevel.value = json['lowStockLevel'] == null ? null : nativeFromJson<int>(json['lowStockLevel']);
  
  
    createdBy = Optional.optional(nativeFromJson, nativeToJson);
    createdBy.value = json['createdBy'] == null ? null : nativeFromJson<String>(json['createdBy']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateProductVariables otherTyped = other as UpdateProductVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
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
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, name.hashCode, category.hashCode, quantity.hashCode, costPrice.hashCode, sellingPrice.hashCode, expiryDate.hashCode, lowStockLevel.hashCode, createdBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(name.state == OptionalState.set) {
      json['name'] = name.toJson();
    }
    if(category.state == OptionalState.set) {
      json['category'] = category.toJson();
    }
    if(quantity.state == OptionalState.set) {
      json['quantity'] = quantity.toJson();
    }
    if(costPrice.state == OptionalState.set) {
      json['costPrice'] = costPrice.toJson();
    }
    if(sellingPrice.state == OptionalState.set) {
      json['sellingPrice'] = sellingPrice.toJson();
    }
    if(expiryDate.state == OptionalState.set) {
      json['expiryDate'] = expiryDate.toJson();
    }
    if(lowStockLevel.state == OptionalState.set) {
      json['lowStockLevel'] = lowStockLevel.toJson();
    }
    if(createdBy.state == OptionalState.set) {
      json['createdBy'] = createdBy.toJson();
    }
    return json;
  }

  UpdateProductVariables({
    required this.id,
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

