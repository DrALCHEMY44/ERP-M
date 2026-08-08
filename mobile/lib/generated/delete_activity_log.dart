part of 'example.dart';

class DeleteActivityLogVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteActivityLogVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteActivityLogData> dataDeserializer = (dynamic json)  => DeleteActivityLogData.fromJson(jsonDecode(json));
  Serializer<DeleteActivityLogVariables> varsSerializer = (DeleteActivityLogVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteActivityLogData, DeleteActivityLogVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteActivityLogData, DeleteActivityLogVariables> ref() {
    DeleteActivityLogVariables vars= DeleteActivityLogVariables(id: id,);
    return _dataConnect.mutation("DeleteActivityLog", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteActivityLogActivityLogDelete {
  final String id;
  DeleteActivityLogActivityLogDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteActivityLogActivityLogDelete otherTyped = other as DeleteActivityLogActivityLogDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteActivityLogActivityLogDelete({
    required this.id,
  });
}

@immutable
class DeleteActivityLogData {
  final DeleteActivityLogActivityLogDelete? activityLog_delete;
  DeleteActivityLogData.fromJson(dynamic json):
  
  activityLog_delete = json['activityLog_delete'] == null ? null : DeleteActivityLogActivityLogDelete.fromJson(json['activityLog_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteActivityLogData otherTyped = other as DeleteActivityLogData;
    return activityLog_delete == otherTyped.activityLog_delete;
    
  }
  @override
  int get hashCode => activityLog_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (activityLog_delete != null) {
      json['activityLog_delete'] = activityLog_delete!.toJson();
    }
    return json;
  }

  DeleteActivityLogData({
    this.activityLog_delete,
  });
}

@immutable
class DeleteActivityLogVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteActivityLogVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteActivityLogVariables otherTyped = other as DeleteActivityLogVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteActivityLogVariables({
    required this.id,
  });
}

