part of 'example.dart';

class DeleteEmployeeVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteEmployeeVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteEmployeeData> dataDeserializer = (dynamic json)  => DeleteEmployeeData.fromJson(jsonDecode(json));
  Serializer<DeleteEmployeeVariables> varsSerializer = (DeleteEmployeeVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteEmployeeData, DeleteEmployeeVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteEmployeeData, DeleteEmployeeVariables> ref() {
    DeleteEmployeeVariables vars= DeleteEmployeeVariables(id: id,);
    return _dataConnect.mutation("DeleteEmployee", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteEmployeeEmployeeDelete {
  final String id;
  DeleteEmployeeEmployeeDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeEmployeeDelete otherTyped = other as DeleteEmployeeEmployeeDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteEmployeeEmployeeDelete({
    required this.id,
  });
}

@immutable
class DeleteEmployeeData {
  final DeleteEmployeeEmployeeDelete? employee_delete;
  DeleteEmployeeData.fromJson(dynamic json):
  
  employee_delete = json['employee_delete'] == null ? null : DeleteEmployeeEmployeeDelete.fromJson(json['employee_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeData otherTyped = other as DeleteEmployeeData;
    return employee_delete == otherTyped.employee_delete;
    
  }
  @override
  int get hashCode => employee_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (employee_delete != null) {
      json['employee_delete'] = employee_delete!.toJson();
    }
    return json;
  }

  DeleteEmployeeData({
    this.employee_delete,
  });
}

@immutable
class DeleteEmployeeVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteEmployeeVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteEmployeeVariables otherTyped = other as DeleteEmployeeVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteEmployeeVariables({
    required this.id,
  });
}

