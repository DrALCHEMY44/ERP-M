part of 'example.dart';

class CreateBusinessVariablesBuilder {
  String tenantId;
  String name;
  String location;
  Optional<String> _businessType = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _region = Optional.optional(nativeFromJson, nativeToJson);
  String code;

  final FirebaseDataConnect _dataConnect;  CreateBusinessVariablesBuilder businessType(String? t) {
   _businessType.value = t;
   return this;
  }
  CreateBusinessVariablesBuilder region(String? t) {
   _region.value = t;
   return this;
  }

  CreateBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.name,required  this.location,required  this.code,});
  Deserializer<CreateBusinessData> dataDeserializer = (dynamic json)  => CreateBusinessData.fromJson(jsonDecode(json));
  Serializer<CreateBusinessVariables> varsSerializer = (CreateBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateBusinessData, CreateBusinessVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateBusinessData, CreateBusinessVariables> ref() {
    CreateBusinessVariables vars= CreateBusinessVariables(tenantId: tenantId,name: name,location: location,businessType: _businessType,region: _region,code: code,);
    return _dataConnect.mutation("CreateBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateBusinessBusinessInsert {
  final String id;
  CreateBusinessBusinessInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateBusinessBusinessInsert otherTyped = other as CreateBusinessBusinessInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateBusinessBusinessInsert({
    required this.id,
  });
}

@immutable
class CreateBusinessData {
  final CreateBusinessBusinessInsert business_insert;
  CreateBusinessData.fromJson(dynamic json):
  
  business_insert = CreateBusinessBusinessInsert.fromJson(json['business_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateBusinessData otherTyped = other as CreateBusinessData;
    return business_insert == otherTyped.business_insert;
    
  }
  @override
  int get hashCode => business_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['business_insert'] = business_insert.toJson();
    return json;
  }

  CreateBusinessData({
    required this.business_insert,
  });
}

@immutable
class CreateBusinessVariables {
  final String tenantId;
  final String name;
  final String location;
  late final Optional<String>businessType;
  late final Optional<String>region;
  final String code;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateBusinessVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  name = nativeFromJson<String>(json['name']),
  location = nativeFromJson<String>(json['location']),
  code = nativeFromJson<String>(json['code']) {
  
  
  
  
  
    businessType = Optional.optional(nativeFromJson, nativeToJson);
    businessType.value = json['businessType'] == null ? null : nativeFromJson<String>(json['businessType']);
  
  
    region = Optional.optional(nativeFromJson, nativeToJson);
    region.value = json['region'] == null ? null : nativeFromJson<String>(json['region']);
  
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateBusinessVariables otherTyped = other as CreateBusinessVariables;
    return tenantId == otherTyped.tenantId && 
    name == otherTyped.name && 
    location == otherTyped.location && 
    businessType == otherTyped.businessType && 
    region == otherTyped.region && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, name.hashCode, location.hashCode, businessType.hashCode, region.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['name'] = nativeToJson<String>(name);
    json['location'] = nativeToJson<String>(location);
    if(businessType.state == OptionalState.set) {
      json['businessType'] = businessType.toJson();
    }
    if(region.state == OptionalState.set) {
      json['region'] = region.toJson();
    }
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  CreateBusinessVariables({
    required this.tenantId,
    required this.name,
    required this.location,
    required this.businessType,
    required this.region,
    required this.code,
  });
}

