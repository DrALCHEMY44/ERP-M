part of 'example.dart';

class UpdateTenantVariablesBuilder {
  String id;
  Optional<String> _name = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessSector = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _location = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _ownerEmail = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _taxId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _logoUrl = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _subscriptionTier = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _status = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateTenantVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder businessSector(String? t) {
   _businessSector.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder ownerEmail(String? t) {
   _ownerEmail.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder taxId(String? t) {
   _taxId.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder logoUrl(String? t) {
   _logoUrl.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder subscriptionTier(String? t) {
   _subscriptionTier.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  UpdateTenantVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateTenantData> dataDeserializer = (dynamic json)  => UpdateTenantData.fromJson(jsonDecode(json));
  Serializer<UpdateTenantVariables> varsSerializer = (UpdateTenantVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateTenantData, UpdateTenantVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateTenantData, UpdateTenantVariables> ref() {
    UpdateTenantVariables vars= UpdateTenantVariables(id: id,name: _name,businessSector: _businessSector,location: _location,ownerEmail: _ownerEmail,taxId: _taxId,logoUrl: _logoUrl,subscriptionTier: _subscriptionTier,status: _status,);
    return _dataConnect.mutation("UpdateTenant", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateTenantTenantUpdate {
  final String id;
  UpdateTenantTenantUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTenantTenantUpdate otherTyped = other as UpdateTenantTenantUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateTenantTenantUpdate({
    required this.id,
  });
}

@immutable
class UpdateTenantData {
  final UpdateTenantTenantUpdate? tenant_update;
  UpdateTenantData.fromJson(dynamic json):
  
  tenant_update = json['tenant_update'] == null ? null : UpdateTenantTenantUpdate.fromJson(json['tenant_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTenantData otherTyped = other as UpdateTenantData;
    return tenant_update == otherTyped.tenant_update;
    
  }
  @override
  int get hashCode => tenant_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (tenant_update != null) {
      json['tenant_update'] = tenant_update!.toJson();
    }
    return json;
  }

  UpdateTenantData({
    this.tenant_update,
  });
}

@immutable
class UpdateTenantVariables {
  final String id;
  late final Optional<String>name;
  late final Optional<String>businessSector;
  late final Optional<String>location;
  late final Optional<String>ownerEmail;
  late final Optional<String>taxId;
  late final Optional<String>logoUrl;
  late final Optional<String>subscriptionTier;
  late final Optional<String>status;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateTenantVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    name = Optional.optional(nativeFromJson, nativeToJson);
    name.value = json['name'] == null ? null : nativeFromJson<String>(json['name']);
  
  
    businessSector = Optional.optional(nativeFromJson, nativeToJson);
    businessSector.value = json['businessSector'] == null ? null : nativeFromJson<String>(json['businessSector']);
  
  
    location = Optional.optional(nativeFromJson, nativeToJson);
    location.value = json['location'] == null ? null : nativeFromJson<String>(json['location']);
  
  
    ownerEmail = Optional.optional(nativeFromJson, nativeToJson);
    ownerEmail.value = json['ownerEmail'] == null ? null : nativeFromJson<String>(json['ownerEmail']);
  
  
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

    final UpdateTenantVariables otherTyped = other as UpdateTenantVariables;
    return id == otherTyped.id && 
    name == otherTyped.name && 
    businessSector == otherTyped.businessSector && 
    location == otherTyped.location && 
    ownerEmail == otherTyped.ownerEmail && 
    taxId == otherTyped.taxId && 
    logoUrl == otherTyped.logoUrl && 
    subscriptionTier == otherTyped.subscriptionTier && 
    status == otherTyped.status;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, name.hashCode, businessSector.hashCode, location.hashCode, ownerEmail.hashCode, taxId.hashCode, logoUrl.hashCode, subscriptionTier.hashCode, status.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(name.state == OptionalState.set) {
      json['name'] = name.toJson();
    }
    if(businessSector.state == OptionalState.set) {
      json['businessSector'] = businessSector.toJson();
    }
    if(location.state == OptionalState.set) {
      json['location'] = location.toJson();
    }
    if(ownerEmail.state == OptionalState.set) {
      json['ownerEmail'] = ownerEmail.toJson();
    }
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

  UpdateTenantVariables({
    required this.id,
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

