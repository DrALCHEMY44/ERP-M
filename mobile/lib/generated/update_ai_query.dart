part of 'example.dart';

class UpdateAiQueryVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _userId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _queryText = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _response = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateAiQueryVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder queryText(String? t) {
   _queryText.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder response(String? t) {
   _response.value = t;
   return this;
  }

  UpdateAiQueryVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateAiQueryData> dataDeserializer = (dynamic json)  => UpdateAiQueryData.fromJson(jsonDecode(json));
  Serializer<UpdateAiQueryVariables> varsSerializer = (UpdateAiQueryVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateAiQueryData, UpdateAiQueryVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateAiQueryData, UpdateAiQueryVariables> ref() {
    UpdateAiQueryVariables vars= UpdateAiQueryVariables(id: id,tenantId: _tenantId,businessId: _businessId,userId: _userId,queryText: _queryText,response: _response,);
    return _dataConnect.mutation("UpdateAiQuery", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateAiQueryAiQueryUpdate {
  final String id;
  UpdateAiQueryAiQueryUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateAiQueryAiQueryUpdate otherTyped = other as UpdateAiQueryAiQueryUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateAiQueryAiQueryUpdate({
    required this.id,
  });
}

@immutable
class UpdateAiQueryData {
  final UpdateAiQueryAiQueryUpdate? aiQuery_update;
  UpdateAiQueryData.fromJson(dynamic json):
  
  aiQuery_update = json['aiQuery_update'] == null ? null : UpdateAiQueryAiQueryUpdate.fromJson(json['aiQuery_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateAiQueryData otherTyped = other as UpdateAiQueryData;
    return aiQuery_update == otherTyped.aiQuery_update;
    
  }
  @override
  int get hashCode => aiQuery_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (aiQuery_update != null) {
      json['aiQuery_update'] = aiQuery_update!.toJson();
    }
    return json;
  }

  UpdateAiQueryData({
    this.aiQuery_update,
  });
}

@immutable
class UpdateAiQueryVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>userId;
  late final Optional<String>queryText;
  late final Optional<String>response;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateAiQueryVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    userId = Optional.optional(nativeFromJson, nativeToJson);
    userId.value = json['userId'] == null ? null : nativeFromJson<String>(json['userId']);
  
  
    queryText = Optional.optional(nativeFromJson, nativeToJson);
    queryText.value = json['queryText'] == null ? null : nativeFromJson<String>(json['queryText']);
  
  
    response = Optional.optional(nativeFromJson, nativeToJson);
    response.value = json['response'] == null ? null : nativeFromJson<String>(json['response']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateAiQueryVariables otherTyped = other as UpdateAiQueryVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    queryText == otherTyped.queryText && 
    response == otherTyped.response;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, userId.hashCode, queryText.hashCode, response.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(userId.state == OptionalState.set) {
      json['userId'] = userId.toJson();
    }
    if(queryText.state == OptionalState.set) {
      json['queryText'] = queryText.toJson();
    }
    if(response.state == OptionalState.set) {
      json['response'] = response.toJson();
    }
    return json;
  }

  UpdateAiQueryVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.queryText,
    required this.response,
  });
}

