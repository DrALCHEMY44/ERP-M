part of 'example.dart';

class DeleteCustomerVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  DeleteCustomerVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<DeleteCustomerData> dataDeserializer = (dynamic json)  => DeleteCustomerData.fromJson(jsonDecode(json));
  Serializer<DeleteCustomerVariables> varsSerializer = (DeleteCustomerVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<DeleteCustomerData, DeleteCustomerVariables>> execute() {
    return ref().execute();
  }

  MutationRef<DeleteCustomerData, DeleteCustomerVariables> ref() {
    DeleteCustomerVariables vars= DeleteCustomerVariables(id: id,);
    return _dataConnect.mutation("DeleteCustomer", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class DeleteCustomerCustomerDelete {
  final String id;
  DeleteCustomerCustomerDelete.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteCustomerCustomerDelete otherTyped = other as DeleteCustomerCustomerDelete;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteCustomerCustomerDelete({
    required this.id,
  });
}

@immutable
class DeleteCustomerData {
  final DeleteCustomerCustomerDelete? customer_delete;
  DeleteCustomerData.fromJson(dynamic json):
  
  customer_delete = json['customer_delete'] == null ? null : DeleteCustomerCustomerDelete.fromJson(json['customer_delete']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteCustomerData otherTyped = other as DeleteCustomerData;
    return customer_delete == otherTyped.customer_delete;
    
  }
  @override
  int get hashCode => customer_delete.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (customer_delete != null) {
      json['customer_delete'] = customer_delete!.toJson();
    }
    return json;
  }

  DeleteCustomerData({
    this.customer_delete,
  });
}

@immutable
class DeleteCustomerVariables {
  final String id;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  DeleteCustomerVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final DeleteCustomerVariables otherTyped = other as DeleteCustomerVariables;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  DeleteCustomerVariables({
    required this.id,
  });
}

