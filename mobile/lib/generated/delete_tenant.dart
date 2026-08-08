part of 'example.dart';

class DeleteTenantVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteTenantVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteTenantData> dataDeserializer = (dynamic json)  => DeleteTenantData.fromJson(jsonDecode(json));
  Serializer<DeleteTenantVariables> varsSerializer = (DeleteTenantVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteTenantData, DeleteTenantVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteTenantData, DeleteTenantVariables> ref() {
    DeleteTenantVariables vars= DeleteTenantVariables(id: id,);
    return _dataConnect.mutation("DeleteTenant", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteTenantTenantDelete {
  final String id;
  DeleteTenantTenantDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTenantTenantDelete otherTyped = other as DeleteTenantTenantDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteTenantTenantDelete({
    required this.id,
  });
}

@immutable
class DeleteTenantData {
  final DeleteTenantTenantDelete? tenant_delete;
  DeleteTenantData.fromJson(dynamic json):
  
  tenant_delete = json['tenant_delete'] == null ? null : DeleteTenantTenantDelete.fromJson(json['tenant_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTenantData otherTyped = other as DeleteTenantData;
    return tenant_delete == otherTyped.tenant_delete;
    
  }
  @override
  int get hashCode => tenant_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (tenant_delete != null) {
      json['tenant_delete'] = tenant_delete!.toJson();
    }
    return json;
  }

  DeleteTenantData({
    this.tenant_delete,
  });
}

@immutable
class DeleteTenantVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteTenantVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteTenantVariables otherTyped = other as DeleteTenantVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteTenantVariables({
    required this.id,
  });
}

