part of 'example.dart';

class ListActivityLogsByUserVariablesBuilder {
  String tenantId;
  String businessId;
  String userId;

  final FirebaseDataConnect _dataConnect;
  ListActivityLogsByUserVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.userId,});
  Deserializer<ListActivityLogsByUserData> dataDeserializer = (dynamic json)  => ListActivityLogsByUserData.fromJson(jsonDecode(json));
  Serializer<ListActivityLogsByUserVariables> varsSerializer = (ListActivityLogsByUserVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListActivityLogsByUserData, ListActivityLogsByUserVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListActivityLogsByUserData, ListActivityLogsByUserVariables> ref() {
    ListActivityLogsByUserVariables vars= ListActivityLogsByUserVariables(tenantId: tenantId,businessId: businessId,userId: userId,);
    return _dataConnect.query("listActivityLogsByUser", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListActivityLogsByUserActivityLogs {
  final String id;
  final String tenantId;
  final String businessId;
  final String userId;
  final String userName;
  final String actionType;
  final String module;
  final String? description;
  final String? recordId;
  final Timestamp timestamp;
  ListActivityLogsByUserActivityLogs.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']),
  userName = nativeFromJson<String>(json['userName']),
  actionType = nativeFromJson<String>(json['actionType']),
  module = nativeFromJson<String>(json['module']),
  description = json['description'] == null ? null : nativeFromJson<String>(json['description']),
  recordId = json['recordId'] == null ? null : nativeFromJson<String>(json['recordId']),
  timestamp = Timestamp.fromJson(json['timestamp']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListActivityLogsByUserActivityLogs otherTyped = other as ListActivityLogsByUserActivityLogs;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId && 
    userName == otherTyped.userName && 
    actionType == otherTyped.actionType && 
    module == otherTyped.module && 
    description == otherTyped.description && 
    recordId == otherTyped.recordId && 
    timestamp == otherTyped.timestamp;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, userId.hashCode, userName.hashCode, actionType.hashCode, module.hashCode, description.hashCode, recordId.hashCode, timestamp.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    json['userName'] = nativeToJson<String>(userName);
    json['actionType'] = nativeToJson<String>(actionType);
    json['module'] = nativeToJson<String>(module);
    if (description != null) {
      json['description'] = nativeToJson<String?>(description);
    }
    if (recordId != null) {
      json['recordId'] = nativeToJson<String?>(recordId);
    }
    json['timestamp'] = timestamp.toJson();
    return json;
  }

  ListActivityLogsByUserActivityLogs({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.userId,
    required this.userName,
    required this.actionType,
    required this.module,
    this.description,
    this.recordId,
    required this.timestamp,
  });
}

@immutable
class ListActivityLogsByUserData {
  final List<ListActivityLogsByUserActivityLogs> activityLogs;
  ListActivityLogsByUserData.fromJson(dynamic json):
  
  activityLogs = (json['activityLogs'] as List<dynamic>)
        .map((e) => ListActivityLogsByUserActivityLogs.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListActivityLogsByUserData otherTyped = other as ListActivityLogsByUserData;
    return activityLogs == otherTyped.activityLogs;
    
  }
  @override
  int get hashCode => activityLogs.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['activityLogs'] = activityLogs.map((e) => e.toJson()).toList();
    return json;
  }

  ListActivityLogsByUserData({
    required this.activityLogs,
  });
}

@immutable
class ListActivityLogsByUserVariables {
  final String tenantId;
  final String businessId;
  final String userId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListActivityLogsByUserVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  userId = nativeFromJson<String>(json['userId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListActivityLogsByUserVariables otherTyped = other as ListActivityLogsByUserVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    userId == otherTyped.userId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, userId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['userId'] = nativeToJson<String>(userId);
    return json;
  }

  ListActivityLogsByUserVariables({
    required this.tenantId,
    required this.businessId,
    required this.userId,
  });
}

