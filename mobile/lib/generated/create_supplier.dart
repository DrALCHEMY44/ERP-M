part of 'example.dart';

class CreateSupplierVariablesBuilder {
  String tenantId;
  String businessId;
  String supplierName;
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateSupplierVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateSupplierVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }

  CreateSupplierVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.supplierName,});
  Deserializer<CreateSupplierData> dataDeserializer = (dynamic json)  => CreateSupplierData.fromJson(jsonDecode(json));
  Serializer<CreateSupplierVariables> varsSerializer = (CreateSupplierVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateSupplierData, CreateSupplierVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateSupplierData, CreateSupplierVariables> ref() {
    CreateSupplierVariables vars= CreateSupplierVariables(tenantId: tenantId,businessId: businessId,supplierName: supplierName,phoneNumber: _phoneNumber,email: _email,);
    return _dataConnect.mutation("CreateSupplier", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateSupplierSupplierInsert {
  final String id;
  CreateSupplierSupplierInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateSupplierSupplierInsert otherTyped = other as CreateSupplierSupplierInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateSupplierSupplierInsert({
    required this.id,
  });
}

@immutable
class CreateSupplierData {
  final CreateSupplierSupplierInsert supplier_insert;
  CreateSupplierData.fromJson(dynamic json):
  
  supplier_insert = CreateSupplierSupplierInsert.fromJson(json['supplier_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateSupplierData otherTyped = other as CreateSupplierData;
    return supplier_insert == otherTyped.supplier_insert;
    
  }
  @override
  int get hashCode => supplier_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['supplier_insert'] = supplier_insert.toJson();
    return json;
  }

  CreateSupplierData({
    required this.supplier_insert,
  });
}

@immutable
class CreateSupplierVariables {
  final String tenantId;
  final String businessId;
  final String supplierName;
  late final Optional<String>phoneNumber;
  late final Optional<String>email;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateSupplierVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  supplierName = nativeFromJson<String>(json['supplierName']) {
  
  
  
  
  
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

    final CreateSupplierVariables otherTyped = other as CreateSupplierVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    supplierName == otherTyped.supplierName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, supplierName.hashCode, phoneNumber.hashCode, email.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['supplierName'] = nativeToJson<String>(supplierName);
    if(phoneNumber.state == OptionalState.set) {
      json['phoneNumber'] = phoneNumber.toJson();
    }
    if(email.state == OptionalState.set) {
      json['email'] = email.toJson();
    }
    return json;
  }

  CreateSupplierVariables({
    required this.tenantId,
    required this.businessId,
    required this.supplierName,
    required this.phoneNumber,
    required this.email,
  });
}

