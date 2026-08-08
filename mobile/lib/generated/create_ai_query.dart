part of 'example.dart';

class CreateAiQueryVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;
  String queryText;
  Optional<String> _response = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  CreateAiQueryVariablesBuilder response(String? t) {
   _response.value = t;
   return this;
  }

  CreateAiQueryVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.userId,required  this.queryText,});
  Deserializer<CreateAiQueryData> dataDeserializer = (dynamic json)  => CreateAiQueryData.fromJson(jsonDecode(json));
  Serializer<CreateAiQueryVariables> varsSerializer = (CreateAiQueryVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateAiQueryData, CreateAiQueryVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateAiQueryData, CreateAiQueryVariables> ref() {
    CreateAiQueryVariables vars= CreateAiQueryVariables(tenantId: tenantId,businessId: businessId,userId: userId,queryText: queryText,response: _response,);
    return _dataConnect.mutation("CreateAiQuery", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateAiQueryAiQueryInsert {
  final String id;
  CreateAiQueryAiQueryInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateAiQueryAiQueryInsert otherTyped = other as CreateAiQueryAiQueryInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateAiQueryAiQueryInsert({
    required this.id,
  });
}

@immutable
class CreateAiQueryData {
  final CreateAiQueryAiQueryInsert aiQuery_insert;
  CreateAiQueryData.fromJson(dynamic json):
  
  aiQuery_insert = CreateAiQueryAiQueryInsert.fromJson(json['aiQuery_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateAiQueryData otherTyped = other as CreateAiQueryData;
    return aiQuery_insert == otherTyped.aiQuery_insert;
    
  }
  @override
  int get hashCode => aiQuery_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['aiQuery_insert'] = aiQuery_insert.toJson();
    return json;
  }

  CreateAiQueryData({
    required this.aiQuery_insert,
  });
}

@immutable
class CreateAiQueryVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  final String queryText;
  late final Optional<String>response;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateAiQueryVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']),
  queryText = nativeFromJson<String>(json['queryText']) {
  
  
  
  
  
  
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

    final CreateAiQueryVariables otherTyped = other as CreateAiQueryVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    queryText == otherTyped.queryText && 
    response == otherTyped.response;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, userId.hashCode, queryText.hashCode, response.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['queryText'] = nativeToJson<String>(queryText);
    if(response.state == OptionalState.set) {
      json['response'] = response.toJson();
    }
    return json;
  }

  CreateAiQueryVariables({
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.queryText,
    required this.response,
  });
}

