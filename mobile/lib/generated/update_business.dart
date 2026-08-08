part of 'example.dart';

class UpdateBusinessVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _name = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _location = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessType = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _region = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _code = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateBusinessVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder businessType(String? t) {
   _businessType.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder region(String? t) {
   _region.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder code(String? t) {
   _code.value = t;
   return this;
  }

  UpdateBusinessVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateBusinessData> dataDeserializer = (dynamic json)  => UpdateBusinessData.fromJson(jsonDecode(json));
  Serializer<UpdateBusinessVariables> varsSerializer = (UpdateBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateBusinessData, UpdateBusinessVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateBusinessData, UpdateBusinessVariables> ref() {
    UpdateBusinessVariables vars= UpdateBusinessVariables(id: id,tenantId: _tenantId,name: _name,location: _location,businessType: _businessType,region: _region,code: _code,);
    return _dataConnect.mutation("UpdateBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateBusinessBusinessUpdate {
  final String id;
  UpdateBusinessBusinessUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessBusinessUpdate otherTyped = other as UpdateBusinessBusinessUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateBusinessBusinessUpdate({
    required this.id,
  });
}

@immutable
class UpdateBusinessData {
  final UpdateBusinessBusinessUpdate? business_update;
  UpdateBusinessData.fromJson(dynamic json):
  
  business_update = json['business_update'] == null ? null : UpdateBusinessBusinessUpdate.fromJson(json['business_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessData otherTyped = other as UpdateBusinessData;
    return business_update == otherTyped.business_update;
    
  }
  @override
  int get hashCode => business_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (business_update != null) {
      json['business_update'] = business_update!.toJson();
    }
    return json;
  }

  UpdateBusinessData({
    this.business_update,
  });
}

@immutable
class UpdateBusinessVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>name;
  late final Optional<String>location;
  late final Optional<String>businessType;
  late final Optional<String>region;
  late final Optional<String>code;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateBusinessVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    name = Optional.optional(nativeFromJson, nativeToJson);
    name.value = json['name'] == null ? null : nativeFromJson<String>(json['name']);
  
  
    location = Optional.optional(nativeFromJson, nativeToJson);
    location.value = json['location'] == null ? null : nativeFromJson<String>(json['location']);
  
  
    businessType = Optional.optional(nativeFromJson, nativeToJson);
    businessType.value = json['businessType'] == null ? null : nativeFromJson<String>(json['businessType']);
  
  
    region = Optional.optional(nativeFromJson, nativeToJson);
    region.value = json['region'] == null ? null : nativeFromJson<String>(json['region']);
  
  
    code = Optional.optional(nativeFromJson, nativeToJson);
    code.value = json['code'] == null ? null : nativeFromJson<String>(json['code']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateBusinessVariables otherTyped = other as UpdateBusinessVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    name == otherTyped.name && 
    location == otherTyped.location && 
    businessType == otherTyped.businessType && 
    region == otherTyped.region && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, name.hashCode, location.hashCode, businessType.hashCode, region.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(name.state == OptionalState.set) {
      json['name'] = name.toJson();
    }
    if(location.state == OptionalState.set) {
      json['location'] = location.toJson();
    }
    if(businessType.state == OptionalState.set) {
      json['businessType'] = businessType.toJson();
    }
    if(region.state == OptionalState.set) {
      json['region'] = region.toJson();
    }
    if(code.state == OptionalState.set) {
      json['code'] = code.toJson();
    }
    return json;
  }

  UpdateBusinessVariables({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.location,
    required this.businessType,
    required this.region,
    required this.code,
  });
}

