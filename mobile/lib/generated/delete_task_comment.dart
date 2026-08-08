part of 'example.dart';

class DeleteTaskCommentVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteTaskCommentVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteTaskCommentData> dataDeserializer = (dynamic json)  => DeleteTaskCommentData.fromJson(jsonDecode(json));
  Serializer<DeleteTaskCommentVariables> varsSerializer = (DeleteTaskCommentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteTaskCommentData, DeleteTaskCommentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteTaskCommentData, DeleteTaskCommentVariables> ref() {
    DeleteTaskCommentVariables vars= DeleteTaskCommentVariables(id: id,);
    return _dataConnect.mutation("DeleteTaskComment", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteTaskCommentTaskCommentDelete {
  final String id;
  DeleteTaskCommentTaskCommentDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTaskCommentTaskCommentDelete otherTyped = other as DeleteTaskCommentTaskCommentDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteTaskCommentTaskCommentDelete({
    required this.id,
  });
}

@immutable
class DeleteTaskCommentData {
  final DeleteTaskCommentTaskCommentDelete? taskComment_delete;
  DeleteTaskCommentData.fromJson(dynamic json):
  
  taskComment_delete = json['taskComment_delete'] == null ? null : DeleteTaskCommentTaskCommentDelete.fromJson(json['taskComment_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTaskCommentData otherTyped = other as DeleteTaskCommentData;
    return taskComment_delete == otherTyped.taskComment_delete;
    
  }
  @override
  int get hashCode => taskComment_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (taskComment_delete != null) {
      json['taskComment_delete'] = taskComment_delete!.toJson();
    }
    return json;
  }

  DeleteTaskCommentData({
    this.taskComment_delete,
  });
}

@immutable
class DeleteTaskCommentVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteTaskCommentVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTaskCommentVariables otherTyped = other as DeleteTaskCommentVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteTaskCommentVariables({
    required this.id,
  });
}

