part of 'example.dart';

class GetBusinessesByNameVariablesBuilder {
  String name;

  final FirebaseDataConnect _dataConnect;
  GetBusinessesByNameVariablesBuilder(this._dataConnect, {required  this.name,});
  Deserializer<GetBusinessesByNameData> dataDeserializer = (dynamic json)  => GetBusinessesByNameData.fromJson(jsonDecode(json));
  Serializer<GetBusinessesByNameVariables> varsSerializer = (GetBusinessesByNameVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetBusinessesByNameData, GetBusinessesByNameVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetBusinessesByNameData, GetBusinessesByNameVariables> ref() {
    GetBusinessesByNameVariables vars= GetBusinessesByNameVariables(name: name,);
    return _dataConnect.query("getBusinessesByName", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class GetBusinessesByNameBusinesses {
  final String id;
  final String tenantId;
  final String name;
  final String code;
  GetBusinessesByNameBusinesses.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  name = nativeFromJson<String>(json['name']),
  code = nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessesByNameBusinesses otherTyped = other as GetBusinessesByNameBusinesses;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    name == otherTyped.name && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, name.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['name'] = nativeToJson<String>(name);
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  GetBusinessesByNameBusinesses({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.code,
  });
}

@immutable
class GetBusinessesByNameData {
  final List<GetBusinessesByNameBusinesses> businesses;
  GetBusinessesByNameData.fromJson(dynamic json):
  
  businesses = (json['businesses'] as List<dynamic>)
        .map((e) => GetBusinessesByNameBusinesses.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessesByNameData otherTyped = other as GetBusinessesByNameData;
    return businesses == otherTyped.businesses;
    
  }
  @override
  int get hashCode => businesses.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businesses'] = businesses.map((e) => e.toJson()).toList();
    return json;
  }

  GetBusinessesByNameData({
    required this.businesses,
  });
}

@immutable
class GetBusinessesByNameVariables {
  final String name;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  GetBusinessesByNameVariables.fromJson(Map<String, dynamic> json):
  
  name = nativeFromJson<String>(json['name']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessesByNameVariables otherTyped = other as GetBusinessesByNameVariables;
    return name == otherTyped.name;
    
  }
  @override
  int get hashCode => name.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['name'] = nativeToJson<String>(name);
    return json;
  }

  GetBusinessesByNameVariables({
    required this.name,
  });
}

