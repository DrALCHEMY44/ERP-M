part of 'example.dart';

class UpdateDocumentVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _title = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _documentType = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _fileUrl = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _uploadedBy = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateDocumentVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder title(String? t) {
   _title.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder documentType(String? t) {
   _documentType.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder fileUrl(String? t) {
   _fileUrl.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder uploadedBy(String? t) {
   _uploadedBy.value = t;
   return this;
  }

  UpdateDocumentVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateDocumentData> dataDeserializer = (dynamic json)  => UpdateDocumentData.fromJson(jsonDecode(json));
  Serializer<UpdateDocumentVariables> varsSerializer = (UpdateDocumentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateDocumentData, UpdateDocumentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateDocumentData, UpdateDocumentVariables> ref() {
    UpdateDocumentVariables vars= UpdateDocumentVariables(id: id,tenantId: _tenantId,businessId: _businessId,title: _title,documentType: _documentType,fileUrl: _fileUrl,uploadedBy: _uploadedBy,);
    return _dataConnect.mutation("UpdateDocument", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateDocumentDocumentUpdate {
  final String id;
  UpdateDocumentDocumentUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateDocumentDocumentUpdate otherTyped = other as UpdateDocumentDocumentUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateDocumentDocumentUpdate({
    required this.id,
  });
}

@immutable
class UpdateDocumentData {
  final UpdateDocumentDocumentUpdate? document_update;
  UpdateDocumentData.fromJson(dynamic json):
  
  document_update = json['document_update'] == null ? null : UpdateDocumentDocumentUpdate.fromJson(json['document_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateDocumentData otherTyped = other as UpdateDocumentData;
    return document_update == otherTyped.document_update;
    
  }
  @override
  int get hashCode => document_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (document_update != null) {
      json['document_update'] = document_update!.toJson();
    }
    return json;
  }

  UpdateDocumentData({
    this.document_update,
  });
}

@immutable
class UpdateDocumentVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<String>title;
  late final Optional<String>documentType;
  late final Optional<String>fileUrl;
  late final Optional<String>uploadedBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateDocumentVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    title = Optional.optional(nativeFromJson, nativeToJson);
    title.value = json['title'] == null ? null : nativeFromJson<String>(json['title']);
  
  
    documentType = Optional.optional(nativeFromJson, nativeToJson);
    documentType.value = json['documentType'] == null ? null : nativeFromJson<String>(json['documentType']);
  
  
    fileUrl = Optional.optional(nativeFromJson, nativeToJson);
    fileUrl.value = json['fileUrl'] == null ? null : nativeFromJson<String>(json['fileUrl']);
  
  
    uploadedBy = Optional.optional(nativeFromJson, nativeToJson);
    uploadedBy.value = json['uploadedBy'] == null ? null : nativeFromJson<String>(json['uploadedBy']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateDocumentVariables otherTyped = other as UpdateDocumentVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    title == otherTyped.title && 
    documentType == otherTyped.documentType && 
    fileUrl == otherTyped.fileUrl && 
    uploadedBy == otherTyped.uploadedBy;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, title.hashCode, documentType.hashCode, fileUrl.hashCode, uploadedBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(title.state == OptionalState.set) {
      json['title'] = title.toJson();
    }
    if(documentType.state == OptionalState.set) {
      json['documentType'] = documentType.toJson();
    }
    if(fileUrl.state == OptionalState.set) {
      json['fileUrl'] = fileUrl.toJson();
    }
    if(uploadedBy.state == OptionalState.set) {
      json['uploadedBy'] = uploadedBy.toJson();
    }
    return json;
  }

  UpdateDocumentVariables({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.title,
    required this.documentType,
    required this.fileUrl,
    required this.uploadedBy,
  });
}

