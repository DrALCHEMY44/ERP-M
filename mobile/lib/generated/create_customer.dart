part of 'example.dart';

class CreateCustomerVariablesBuilder {
  String tenantId;
  String businessId;
  String customerName;
  Optional<String> _phoneNumber = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _email = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _location = Optional.optional(nativeFromJson, nativeToJson);
  Optional<int> _totalOrders = Optional.optional(nativeFromJson, nativeToJson);
  Optional<double> _totalSpent = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateCustomerVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder totalOrders(int? t) {
   _totalOrders.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder totalSpent(double? t) {
   _totalSpent.value = t;
   return this;
  }

  CreateCustomerVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.customerName,});
  Deserializer<CreateCustomerData> dataDeserializer = (dynamic json)  => CreateCustomerData.fromJson(jsonDecode(json));
  Serializer<CreateCustomerVariables> varsSerializer = (CreateCustomerVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateCustomerData, CreateCustomerVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateCustomerData, CreateCustomerVariables> ref() {
    CreateCustomerVariables vars= CreateCustomerVariables(tenantId: tenantId,businessId: businessId,customerName: customerName,phoneNumber: _phoneNumber,email: _email,location: _location,totalOrders: _totalOrders,totalSpent: _totalSpent,);
    return _dataConnect.mutation("CreateCustomer", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateCustomerCustomerInsert {
  final String id;
  CreateCustomerCustomerInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateCustomerCustomerInsert otherTyped = other as CreateCustomerCustomerInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateCustomerCustomerInsert({
    required this.id,
  });
}

@immutable
class CreateCustomerData {
  final CreateCustomerCustomerInsert customer_insert;
  CreateCustomerData.fromJson(dynamic json):
  
  customer_insert = CreateCustomerCustomerInsert.fromJson(json['customer_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateCustomerData otherTyped = other as CreateCustomerData;
    return customer_insert == otherTyped.customer_insert;
    
  }
  @override
  int get hashCode => customer_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['customer_insert'] = customer_insert.toJson();
    return json;
  }

  CreateCustomerData({
    required this.customer_insert,
  });
}

@immutable
class CreateCustomerVariables {
  final String tenantId;
  final String businessId;
  final String customerName;
  late final Optional<String>phoneNumber;
  late final Optional<String>email;
  late final Optional<String>location;
  late final Optional<int>totalOrders;
  late final Optional<double>totalSpent;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateCustomerVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  customerName = nativeFromJson<String>(json['customerName']) {
  
  
  
  
  
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

    final CreateCustomerVariables otherTyped = other as CreateCustomerVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    customerName == otherTyped.customerName && 
    phoneNumber == otherTyped.phoneNumber && 
    email == otherTyped.email && 
    location == otherTyped.location && 
    totalOrders == otherTyped.totalOrders && 
    totalSpent == otherTyped.totalSpent;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, customerName.hashCode, phoneNumber.hashCode, email.hashCode, location.hashCode, totalOrders.hashCode, totalSpent.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['customerName'] = nativeToJson<String>(customerName);
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

  CreateCustomerVariables({
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

