part of 'example.dart';

class GetBusinessByIdVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  GetBusinessByIdVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<GetBusinessByIdData> dataDeserializer = (dynamic json)  => GetBusinessByIdData.fromJson(jsonDecode(json));
  Serializer<GetBusinessByIdVariables> varsSerializer = (GetBusinessByIdVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<GetBusinessByIdData, GetBusinessByIdVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<GetBusinessByIdData, GetBusinessByIdVariables> ref() {
    GetBusinessByIdVariables vars= GetBusinessByIdVariables(id: id,);
    return _dataConnect.query("getBusinessById", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class GetBusinessByIdBusiness {
  final String id;
  final String tenantId;
  final String name;
  final Timestamp createdAt;
  final String code;
  GetBusinessByIdBusiness.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  name = nativeFromJson<String>(json['name']),
  createdAt = Timestamp.fromJson(json['createdAt']),
  code = nativeFromJson<String>(json['code']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdBusiness otherTyped = other as GetBusinessByIdBusiness;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    name == otherTyped.name && 
    createdAt == otherTyped.createdAt && 
    code == otherTyped.code;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, name.hashCode, createdAt.hashCode, code.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['name'] = nativeToJson<String>(name);
    json['createdAt'] = createdAt.toJson();
    json['code'] = nativeToJson<String>(code);
    return json;
  }

  GetBusinessByIdBusiness({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.createdAt,
    required this.code,
  });
}

@immutable
class GetBusinessByIdData {
  final GetBusinessByIdBusiness? business;
  GetBusinessByIdData.fromJson(dynamic json):
  
  business = json['business'] == null ? null : GetBusinessByIdBusiness.fromJson(json['business']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdData otherTyped = other as GetBusinessByIdData;
    return business == otherTyped.business;
    
  }
  @override
  int get hashCode => business.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (business != null) {
      json['business'] = business!.toJson();
    }
    return json;
  }

  GetBusinessByIdData({
    this.business,
  });
}

@immutable
class GetBusinessByIdVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  GetBusinessByIdVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final GetBusinessByIdVariables otherTyped = other as GetBusinessByIdVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  GetBusinessByIdVariables({
    required this.id,
  });
}

