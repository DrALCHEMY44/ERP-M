part of 'example.dart';

class ListBusinessesVariablesBuilder {
  String tenantId;

  final FirebaseDataConnect _dataConnect;
  ListBusinessesVariablesBuilder(this._dataConnect, {required  this.tenantId,});
  Deserializer<ListBusinessesData> dataDeserializer = (dynamic json)  => ListBusinessesData.fromJson(jsonDecode(json));
  Serializer<ListBusinessesVariables> varsSerializer = (ListBusinessesVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListBusinessesData, ListBusinessesVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListBusinessesData, ListBusinessesVariables> ref() {
    ListBusinessesVariables vars= ListBusinessesVariables(tenantId: tenantId,);
    return _dataConnect.query("ListBusinesses", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListBusinessesBusinesses {
  final String id;
  final String name;
  final String location;
  ListBusinessesBusinesses.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  name = nativeFromJson<String>(json['name']),
  location = nativeFromJson<String>(json['location']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListBusinessesBusinesses otherTyped = other as ListBusinessesBusinesses;
    return id == otherTyped.id && 
    name == otherTyped.name && 
    location == otherTyped.location;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, name.hashCode, location.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['name'] = nativeToJson<String>(name);
    json['location'] = nativeToJson<String>(location);
    return json;
  }

  ListBusinessesBusinesses({
    required this.id,
    required this.name,
    required this.location,
  });
}

@immutable
class ListBusinessesData {
  final List<ListBusinessesBusinesses> businesses;
  ListBusinessesData.fromJson(dynamic json):
  
  businesses = (json['businesses'] as List<dynamic>)
        .map((e) => ListBusinessesBusinesses.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListBusinessesData otherTyped = other as ListBusinessesData;
    return businesses == otherTyped.businesses;
    
  }
  @override
  int get hashCode => businesses.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['businesses'] = businesses.map((e) => e.toJson()).toList();
    return json;
  }

  ListBusinessesData({
    required this.businesses,
  });
}

@immutable
class ListBusinessesVariables {
  final String tenantId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListBusinessesVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListBusinessesVariables otherTyped = other as ListBusinessesVariables;
    return tenantId == otherTyped.tenantId;
    
  }
  @override
  int get hashCode => tenantId.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    return json;
  }

  ListBusinessesVariables({
    required this.tenantId,
  });
}

