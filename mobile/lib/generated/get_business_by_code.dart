part of 'example.dart';

class GetBusinessByCodeVariablesBuilder {
  String code;

  final FirebaseDataConnect _dataConnect;
  GetBusinessByCodeVariablesBuilder(this._dataConnect, {required  this.code,});
  Deserializer<GetBusinessByCodeData> dataDeserializer = (dynamic json)  => GetBusinessByCodeData.fromJson(jsonDecode(json));
  Serializer<GetBusinessByCodeVariables> varsSerializer = (GetBusinessByCodeVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetBusinessByCodeData, GetBusinessByCodeVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetBusinessByCodeData, GetBusinessByCodeVariables> ref() {
    GetBusinessByCodeVariables vars= GetBusinessByCodeVariables(code: code,);
    return _dataConnect.query("getBusinessByCode", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class GetBusinessByCodeBusinesses {
  final String id;
  final String tenantId;
  final String name;
  GetBusinessByCodeBusinesses.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  name = nativeFromJson<String>(json['name']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByCodeBusinesses otherTyped = other as GetBusinessByCodeBusinesses;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    name == otherTyped.name;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, name.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['name'] = nativeToJson<String>(name);
    return json;
  }

  GetBusinessByCodeBusinesses({
    required this.id,
    required this.tenantId,
    required this.name,
  });
}

@immutable
class GetBusinessByCodeData {
  final List<GetBusinessByCodeBusinesses> businesses;
  GetBusinessByCodeData.fromJson(dynamic json):
  
  businesses = (json['businesses'] as List<dynamic>)
        .map((e) => GetBusinessByCodeBusinesses.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByCodeData otherTyped = other as GetBusinessByCodeData;
    return businesses == otherTyped.businesses;
    
  }
  @override
  int get hashCode => businesses.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businesses'] = businesses.map((e) => e.toJson()).toList();
    return json;
  }

  GetBusinessByCodeData({
    required this.businesses,
  });
}

@immutable
class GetBusinessByCodeVariables {
  final String code;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  GetBusinessByCodeVariables.fromJson(Map<String, dynamic> json):
  
  code = nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByCodeVariables otherTyped = other as GetBusinessByCodeVariables;
    return code == otherTyped.code;
    
  }
  @override
  int get hashCode => code.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  GetBusinessByCodeVariables({
    required this.code,
  });
}

