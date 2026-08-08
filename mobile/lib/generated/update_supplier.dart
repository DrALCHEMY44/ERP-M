part of 'example.dart';

class UpdateSupplierVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _supplierName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateSupplierVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder supplierName(String? t) {
   _supplierName.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }

  UpdateSupplierVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateSupplierData> dataDeserializer = (dynamic json)  => UpdateSupplierData.fromJson(jsonDecode(json));
  Serializer<UpdateSupplierVariables> varsSerializer = (UpdateSupplierVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateSupplierData, UpdateSupplierVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateSupplierData, UpdateSupplierVariables> ref() {
    UpdateSupplierVariables vars= UpdateSupplierVariables(id: id,tenantId: _tenantId,businessId: _businessId,supplierName: _supplierName,phoneNumber: _phoneNumber,email: _email,);
    return _dataConnect.mutation("UpdateSupplier", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateSupplierSupplierUpdate {
  final String id;
  UpdateSupplierSupplierUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateSupplierSupplierUpdate otherTyped = other as UpdateSupplierSupplierUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateSupplierSupplierUpdate({
    required this.id,
  });
}

@immutable
class UpdateSupplierData {
  final UpdateSupplierSupplierUpdate? supplier_update;
  UpdateSupplierData.fromJson(dynamic json):
  
  supplier_update = json['supplier_update'] == null ? null : UpdateSupplierSupplierUpdate.fromJson(json['supplier_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateSupplierData otherTyped = other as UpdateSupplierData;
    return supplier_update == otherTyped.supplier_update;
    
  }
  @override
  int get hashCode => supplier_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (supplier_update != null) {
      json['supplier_update'] = supplier_update!.toJson();
    }
    return json;
  }

  UpdateSupplierData({
    this.supplier_update,
  });
}

@immutable
class UpdateSupplierVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>supplierName;
  late final Optional<String>phoneNumber;
  late final Optional<String>email;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateSupplierVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    supplierName = Optional.optional(nativeFromJson, nativeToJson);
    supplierName.value = json['supplierName'] == null ? null : nativeFromJson<String>(json['supplierName']);
  
  
    phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
    phoneNumber.value = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']);
  
  
    email = Optional.optional(nativeFromJson, nativeToJson);
    email.value = json['email'] == null ? null : nativeFromJson<String>(json['email']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateSupplierVariables otherTyped = other as UpdateSupplierVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    supplierName == otherTyped.supplierName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, supplierName.hashCode, phoneNumber.hashCode, email.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(supplierName.state == OptionalState.set) {
      json['supplierName'] = supplierName.toJson();
    }
    if(phoneNumber.state == OptionalState.set) {
      json['phoneNumber'] = phoneNumber.toJson();
    }
    if(email.state == OptionalState.set) {
      json['email'] = email.toJson();
    }
    return json;
  }

  UpdateSupplierVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.supplierName,
    required this.phoneNumber,
    required this.email,
  });
}

