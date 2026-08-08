part of 'example.dart';

class CreateTenantVariablesBuilder {
  String name;
  String businessSector;
  String location;
  String ownerEmail;
  Optional<String> _taxId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _logoUrl = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _subscriptionTier = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _status = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateTenantVariablesBuilder taxId(String? t) {
   _taxId.value = t;
   return this;
  }
  CreateTenantVariablesBuilder logoUrl(String? t) {
   _logoUrl.value = t;
   return this;
  }
  CreateTenantVariablesBuilder subscriptionTier(String? t) {
   _subscriptionTier.value = t;
   return this;
  }
  CreateTenantVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  CreateTenantVariablesBuilder(this._dataConnect, {required  this.name,required  this.businessSector,required  this.location,required  this.ownerEmail,});
  Deserializer<CreateTenantData> dataDeserializer = (dynamic json)  => CreateTenantData.fromJson(jsonDecode(json));
  Serializer<CreateTenantVariables> varsSerializer = (CreateTenantVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateTenantData, CreateTenantVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateTenantData, CreateTenantVariables> ref() {
    CreateTenantVariables vars= CreateTenantVariables(name: name,businessSector: businessSector,location: location,ownerEmail: ownerEmail,taxId: _taxId,logoUrl: _logoUrl,subscriptionTier: _subscriptionTier,status: _status,);
    return _dataConnect.mutation("CreateTenant", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateTenantTenantInsert {
  final String id;
  CreateTenantTenantInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTenantTenantInsert otherTyped = other as CreateTenantTenantInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateTenantTenantInsert({
    required this.id,
  });
}

@immutable
class CreateTenantData {
  final CreateTenantTenantInsert tenant_insert;
  CreateTenantData.fromJson(dynamic json):
  
  tenant_insert = CreateTenantTenantInsert.fromJson(json['tenant_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTenantData otherTyped = other as CreateTenantData;
    return tenant_insert == otherTyped.tenant_insert;
    
  }
  @override
  int get hashCode => tenant_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenant_insert'] = tenant_insert.toJson();
    return json;
  }

  CreateTenantData({
    required this.tenant_insert,
  });
}

@immutable
class CreateTenantVariables {
  final String name;
  final String businessSector;
  final String location;
  final String ownerEmail;
  late final Optional<String>taxId;
  late final Optional<String>logoUrl;
  late final Optional<String>subscriptionTier;
  late final Optional<String>status;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateTenantVariables.fromJson(Map<String, dynamic> json):
  
  name = nativeFromJson<String>(json['name']),
  businessSector = nativeFromJson<String>(json['businessSector']),
  location = nativeFromJson<String>(json['location']),
  ownerEmail = nativeFromJson<String>(json['ownerEmail']) {
  
  
  
  
  
  
    taxId = Optional.optional(nativeFromJson, nativeToJson);
    taxId.value = json['taxId'] == null ? null : nativeFromJson<String>(json['taxId']);
  
  
    logoUrl = Optional.optional(nativeFromJson, nativeToJson);
    logoUrl.value = json['logoUrl'] == null ? null : nativeFromJson<String>(json['logoUrl']);
  
  
    subscriptionTier = Optional.optional(nativeFromJson, nativeToJson);
    subscriptionTier.value = json['subscriptionTier'] == null ? null : nativeFromJson<String>(json['subscriptionTier']);
  
  
    status = Optional.optional(nativeFromJson, nativeToJson);
    status.value = json['status'] == null ? null : nativeFromJson<String>(json['status']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTenantVariables otherTyped = other as CreateTenantVariables;
    return name == otherTyped.name && 
    businessSector == otherTyped.businessSector && 
    location == otherTyped.location && 
    ownerEmail == otherTyped.ownerEmail && 
    taxId == otherTyped.taxId && 
    logoUrl == otherTyped.logoUrl && 
    subscriptionTier == otherTyped.subscriptionTier && 
    status == otherTyped.status;
    
  }
  @override
  int get hashCode => Object.hashAll([name.hashCode, businessSector.hashCode, location.hashCode, ownerEmail.hashCode, taxId.hashCode, logoUrl.hashCode, subscriptionTier.hashCode, status.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['name'] = nativeToJson<String>(name);
    json['businessSector'] = nativeToJson<String>(businessSector);
    json['location'] = nativeToJson<String>(location);
    json['ownerEmail'] = nativeToJson<String>(ownerEmail);
    if(taxId.state == OptionalState.set) {
      json['taxId'] = taxId.toJson();
    }
    if(logoUrl.state == OptionalState.set) {
      json['logoUrl'] = logoUrl.toJson();
    }
    if(subscriptionTier.state == OptionalState.set) {
      json['subscriptionTier'] = subscriptionTier.toJson();
    }
    if(status.state == OptionalState.set) {
      json['status'] = status.toJson();
    }
    return json;
  }

  CreateTenantVariables({
    required this.name,
    required this.businessSector,
    required this.location,
    required this.ownerEmail,
    required this.taxId,
    required this.logoUrl,
    required this.subscriptionTier,
    required this.status,
  });
}

