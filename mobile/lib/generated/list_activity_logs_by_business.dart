part of 'example.dart';

class ListActivityLogsByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListActivityLogsByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListActivityLogsByBusinessData> dataDeserializer = (dynamic json)  => ListActivityLogsByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListActivityLogsByBusinessVariables> varsSerializer = (ListActivityLogsByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables> ref() {
    ListActivityLogsByBusinessVariables vars= ListActivityLogsByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listActivityLogsByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListActivityLogsByBusinessActivityLogs {
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
  ListActivityLogsByBusinessActivityLogs.fromJson(dynamic json):
  
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

    final ListActivityLogsByBusinessActivityLogs otherTyped = other as ListActivityLogsByBusinessActivityLogs;
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

  ListActivityLogsByBusinessActivityLogs({
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
class ListActivityLogsByBusinessData {
  final List<ListActivityLogsByBusinessActivityLogs> activityLogs;
  ListActivityLogsByBusinessData.fromJson(dynamic json):
  
  activityLogs = (json['activityLogs'] as List<dynamic>)
        .map((e) => ListActivityLogsByBusinessActivityLogs.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListActivityLogsByBusinessData otherTyped = other as ListActivityLogsByBusinessData;
    return activityLogs == otherTyped.activityLogs;
    
  }
  @override
  int get hashCode => activityLogs.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['activityLogs'] = activityLogs.map((e) => e.toJson()).toList();
    return json;
  }

  ListActivityLogsByBusinessData({
    required this.activityLogs,
  });
}

@immutable
class ListActivityLogsByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListActivityLogsByBusinessVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListActivityLogsByBusinessVariables otherTyped = other as ListActivityLogsByBusinessVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListActivityLogsByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

