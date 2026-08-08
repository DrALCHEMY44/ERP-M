part of 'example.dart';

class UpdateCustomerVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _customerName = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _location = Optional.optional(nativeFromJson, nativeToJson);
  Optional<int> _totalOrders = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _totalSpent = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateCustomerVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder customerName(String? t) {
   _customerName.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder totalOrders(int? t) {
   _totalOrders.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder totalSpent(double? t) {
   _totalSpent.value = t;
   return this;
  }

  UpdateCustomerVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateCustomerData> dataDeserializer = (dynamic json)  => UpdateCustomerData.fromJson(jsonDecode(json));
  Serializer<UpdateCustomerVariables> varsSerializer = (UpdateCustomerVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateCustomerData, UpdateCustomerVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateCustomerData, UpdateCustomerVariables> ref() {
    UpdateCustomerVariables vars= UpdateCustomerVariables(id: id,tenantId: _tenantId,businessId: _businessId,customerName: _customerName,phoneNumber: _phoneNumber,email: _email,location: _location,totalOrders: _totalOrders,totalSpent: _totalSpent,);
    return _dataConnect.mutation("UpdateCustomer", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateCustomerCustomerUpdate {
  final String id;
  UpdateCustomerCustomerUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateCustomerCustomerUpdate otherTyped = other as UpdateCustomerCustomerUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateCustomerCustomerUpdate({
    required this.id,
  });
}

@immutable
class UpdateCustomerData {
  final UpdateCustomerCustomerUpdate? customer_update;
  UpdateCustomerData.fromJson(dynamic json):
  
  customer_update = json['customer_update'] == null ? null : UpdateCustomerCustomerUpdate.fromJson(json['customer_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateCustomerData otherTyped = other as UpdateCustomerData;
    return customer_update == otherTyped.customer_update;
    
  }
  @override
  int get hashCode => customer_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (customer_update != null) {
      json['customer_update'] = customer_update!.toJson();
    }
    return json;
  }

  UpdateCustomerData({
    this.customer_update,
  });
}

@immutable
class UpdateCustomerVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>customerName;
  late final Optional<String>phoneNumber;
  late final Optional<String>email;
  late final Optional<String>location;
  late final Optional<int>totalOrders;
  late final Optional<double>totalSpent;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateCustomerVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    customerName = Optional.optional(nativeFromJson, nativeToJson);
    customerName.value = json['customerName'] == null ? null : nativeFromJson<String>(json['customerName']);
  
  
    phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
    phoneNumber.value = json['phoneNumber'] == null ? null : nativeFromJson<String>(json['phoneNumber']);
  
  
    email = Optional.optional(nativeFromJson, nativeToJson);
    email.value = json['email'] == null ? null : nativeFromJson<String>(json['email']);
  
  
    location = Optional.optional(nativeFromJson, nativeToJson);
    location.value = json['location'] == null ? null : nativeFromJson<String>(json['location']);
  
  
    totalOrders = Optional.optional(nativeFromJson, nativeToJson);
    totalOrders.value = json['totalOrders'] == null ? null : nativeFromJson<int>(json['totalOrders']);
  
  
    totalSpent = Optional.optional(nativeFromJson, nativeToJson);
    totalSpent.value = json['totalSpent'] == null ? null : nativeFromJson<double>(json['totalSpent']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateCustomerVariables otherTyped = other as UpdateCustomerVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    customerName == otherTyped.customerName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email && 
    location == otherTyped.location && 
    totalOrders == otherTyped.totalOrders && 
    totalSpent == otherTyped.totalSpent;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, customerName.hashCode, phoneNumber.hashCode, email.hashCode, location.hashCode, totalOrders.hashCode, totalSpent.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(customerName.state == OptionalState.set) {
      json['customerName'] = customerName.toJson();
    }
    if(phoneNumber.state == OptionalState.set) {
      json['phoneNumber'] = phoneNumber.toJson();
    }
    if(email.state == OptionalState.set) {
      json['email'] = email.toJson();
    }
    if(location.state == OptionalState.set) {
      json['location'] = location.toJson();
    }
    if(totalOrders.state == OptionalState.set) {
      json['totalOrders'] = totalOrders.toJson();
    }
    if(totalSpent.state == OptionalState.set) {
      json['totalSpent'] = totalSpent.toJson();
    }
    return json;
  }

  UpdateCustomerVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.customerName,
    required this.phoneNumber,
    required this.email,
    required this.location,
    required this.totalOrders,
    required this.totalSpent,
  });
}

