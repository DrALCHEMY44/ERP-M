part of 'example.dart';

class CreateMirrorOutboxVariablesBuilder {
  String tenantId;
  String businessId;
  String entityType;
  String operation;
  String recordId;
  AnyValue payload;

  final FirebaseDataConnect _dataConnect;
  CreateMirrorOutboxVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.entityType,required  this.operation,required  this.recordId,required  this.payload,});
  Deserializer<CreateMirrorOutboxData> dataDeserializer = (dynamic json)  => CreateMirrorOutboxData.fromJson(jsonDecode(json));
  Serializer<CreateMirrorOutboxVariables> varsSerializer = (CreateMirrorOutboxVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateMirrorOutboxData, CreateMirrorOutboxVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateMirrorOutboxData, CreateMirrorOutboxVariables> ref() {
    CreateMirrorOutboxVariables vars= CreateMirrorOutboxVariables(tenantId: tenantId,businessId: businessId,entityType: entityType,operation: operation,recordId: recordId,payload: payload,);
    return _dataConnect.mutation("CreateMirrorOutbox", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateMirrorOutboxMirrorOutboxInsert {
  final String id;
  CreateMirrorOutboxMirrorOutboxInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateMirrorOutboxMirrorOutboxInsert otherTyped = other as CreateMirrorOutboxMirrorOutboxInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateMirrorOutboxMirrorOutboxInsert({
    required this.id,
  });
}

@immutable
class CreateMirrorOutboxData {
  final CreateMirrorOutboxMirrorOutboxInsert mirrorOutbox_insert;
  CreateMirrorOutboxData.fromJson(dynamic json):
  
  mirrorOutbox_insert = CreateMirrorOutboxMirrorOutboxInsert.fromJson(json['mirrorOutbox_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateMirrorOutboxData otherTyped = other as CreateMirrorOutboxData;
    return mirrorOutbox_insert == otherTyped.mirrorOutbox_insert;
    
  }
  @override
  int get hashCode => mirrorOutbox_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['mirrorOutbox_insert'] = mirrorOutbox_insert.toJson();
    return json;
  }

  CreateMirrorOutboxData({
    required this.mirrorOutbox_insert,
  });
}

@immutable
class CreateMirrorOutboxVariables {
  final String tenantId;
  final String businessId;
  final String entityType;
  final String operation;
  final String recordId;
  final AnyValue payload;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateMirrorOutboxVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  entityType = nativeFromJson<String>(json['entityType']),
  operation = nativeFromJson<String>(json['operation']),
  recordId = nativeFromJson<String>(json['recordId']),
  payload = AnyValue.fromJson(json['payload']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateMirrorOutboxVariables otherTyped = other as CreateMirrorOutboxVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    entityType == otherTyped.entityType && 
    operation == otherTyped.operation && 
    recordId == otherTyped.recordId && 
    payload == otherTyped.payload;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, entityType.hashCode, operation.hashCode, recordId.hashCode, payload.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['entityType'] = nativeToJson<String>(entityType);
    json['operation'] = nativeToJson<String>(operation);
    json['recordId'] = nativeToJson<String>(recordId);
    json['payload'] = payload.toJson();
    return json;
  }

  CreateMirrorOutboxVariables({
    required this.tenantId,
    required this.businessId,
    required this.entityType,
    required this.operation,
    required this.recordId,
    required this.payload,
  });
}

