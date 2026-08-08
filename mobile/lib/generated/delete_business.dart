part of 'example.dart';

class DeleteBusinessVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteBusinessVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteBusinessData> dataDeserializer = (dynamic json)  => DeleteBusinessData.fromJson(jsonDecode(json));
  Serializer<DeleteBusinessVariables> varsSerializer = (DeleteBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteBusinessData, DeleteBusinessVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteBusinessData, DeleteBusinessVariables> ref() {
    DeleteBusinessVariables vars= DeleteBusinessVariables(id: id,);
    return _dataConnect.mutation("DeleteBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteBusinessBusinessDelete {
  final String id;
  DeleteBusinessBusinessDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteBusinessBusinessDelete otherTyped = other as DeleteBusinessBusinessDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteBusinessBusinessDelete({
    required this.id,
  });
}

@immutable
class DeleteBusinessData {
  final DeleteBusinessBusinessDelete? business_delete;
  DeleteBusinessData.fromJson(dynamic json):
  
  business_delete = json['business_delete'] == null ? null : DeleteBusinessBusinessDelete.fromJson(json['business_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteBusinessData otherTyped = other as DeleteBusinessData;
    return business_delete == otherTyped.business_delete;
    
  }
  @override
  int get hashCode => business_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (business_delete != null) {
      json['business_delete'] = business_delete!.toJson();
    }
    return json;
  }

  DeleteBusinessData({
    this.business_delete,
  });
}

@immutable
class DeleteBusinessVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteBusinessVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteBusinessVariables otherTyped = other as DeleteBusinessVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteBusinessVariables({
    required this.id,
  });
}

