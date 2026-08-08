part of 'example.dart';

class DeleteDocumentVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteDocumentVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteDocumentData> dataDeserializer = (dynamic json)  => DeleteDocumentData.fromJson(jsonDecode(json));
  Serializer<DeleteDocumentVariables> varsSerializer = (DeleteDocumentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteDocumentData, DeleteDocumentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteDocumentData, DeleteDocumentVariables> ref() {
    DeleteDocumentVariables vars= DeleteDocumentVariables(id: id,);
    return _dataConnect.mutation("DeleteDocument", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteDocumentDocumentDelete {
  final String id;
  DeleteDocumentDocumentDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteDocumentDocumentDelete otherTyped = other as DeleteDocumentDocumentDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteDocumentDocumentDelete({
    required this.id,
  });
}

@immutable
class DeleteDocumentData {
  final DeleteDocumentDocumentDelete? document_delete;
  DeleteDocumentData.fromJson(dynamic json):
  
  document_delete = json['document_delete'] == null ? null : DeleteDocumentDocumentDelete.fromJson(json['document_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteDocumentData otherTyped = other as DeleteDocumentData;
    return document_delete == otherTyped.document_delete;
    
  }
  @override
  int get hashCode => document_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (document_delete != null) {
      json['document_delete'] = document_delete!.toJson();
    }
    return json;
  }

  DeleteDocumentData({
    this.document_delete,
  });
}

@immutable
class DeleteDocumentVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteDocumentVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteDocumentVariables otherTyped = other as DeleteDocumentVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteDocumentVariables({
    required this.id,
  });
}

