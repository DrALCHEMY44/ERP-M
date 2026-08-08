part of 'example.dart';

class DeleteSupplierVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteSupplierVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteSupplierData> dataDeserializer = (dynamic json)  => DeleteSupplierData.fromJson(jsonDecode(json));
  Serializer<DeleteSupplierVariables> varsSerializer = (DeleteSupplierVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteSupplierData, DeleteSupplierVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteSupplierData, DeleteSupplierVariables> ref() {
    DeleteSupplierVariables vars= DeleteSupplierVariables(id: id,);
    return _dataConnect.mutation("DeleteSupplier", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteSupplierSupplierDelete {
  final String id;
  DeleteSupplierSupplierDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteSupplierSupplierDelete otherTyped = other as DeleteSupplierSupplierDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteSupplierSupplierDelete({
    required this.id,
  });
}

@immutable
class DeleteSupplierData {
  final DeleteSupplierSupplierDelete? supplier_delete;
  DeleteSupplierData.fromJson(dynamic json):
  
  supplier_delete = json['supplier_delete'] == null ? null : DeleteSupplierSupplierDelete.fromJson(json['supplier_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteSupplierData otherTyped = other as DeleteSupplierData;
    return supplier_delete == otherTyped.supplier_delete;
    
  }
  @override
  int get hashCode => supplier_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (supplier_delete != null) {
      json['supplier_delete'] = supplier_delete!.toJson();
    }
    return json;
  }

  DeleteSupplierData({
    this.supplier_delete,
  });
}

@immutable
class DeleteSupplierVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteSupplierVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteSupplierVariables otherTyped = other as DeleteSupplierVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteSupplierVariables({
    required this.id,
  });
}

