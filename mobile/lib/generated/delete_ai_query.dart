part of 'example.dart';

class DeleteAiQueryVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteAiQueryVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteAiQueryData> dataDeserializer = (dynamic json)  => DeleteAiQueryData.fromJson(jsonDecode(json));
  Serializer<DeleteAiQueryVariables> varsSerializer = (DeleteAiQueryVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteAiQueryData, DeleteAiQueryVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteAiQueryData, DeleteAiQueryVariables> ref() {
    DeleteAiQueryVariables vars= DeleteAiQueryVariables(id: id,);
    return _dataConnect.mutation("DeleteAiQuery", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteAiQueryAiQueryDelete {
  final String id;
  DeleteAiQueryAiQueryDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteAiQueryAiQueryDelete otherTyped = other as DeleteAiQueryAiQueryDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteAiQueryAiQueryDelete({
    required this.id,
  });
}

@immutable
class DeleteAiQueryData {
  final DeleteAiQueryAiQueryDelete? aiQuery_delete;
  DeleteAiQueryData.fromJson(dynamic json):
  
  aiQuery_delete = json['aiQuery_delete'] == null ? null : DeleteAiQueryAiQueryDelete.fromJson(json['aiQuery_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteAiQueryData otherTyped = other as DeleteAiQueryData;
    return aiQuery_delete == otherTyped.aiQuery_delete;
    
  }
  @override
  int get hashCode => aiQuery_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (aiQuery_delete != null) {
      json['aiQuery_delete'] = aiQuery_delete!.toJson();
    }
    return json;
  }

  DeleteAiQueryData({
    this.aiQuery_delete,
  });
}

@immutable
class DeleteAiQueryVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteAiQueryVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteAiQueryVariables otherTyped = other as DeleteAiQueryVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteAiQueryVariables({
    required this.id,
  });
}

