part of 'example.dart';

class CreateDocumentVariablesBuilder {
  String tenantId;
  String businessId;
  String title;
  String documentType;
  String fileUrl;
  String uploadedBy;

  final FirebaseDataConnect _dataConnect;
  CreateDocumentVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.title,required  this.documentType,required  this.fileUrl,required  this.uploadedBy,});
  Deserializer<CreateDocumentData> dataDeserializer = (dynamic json)  => CreateDocumentData.fromJson(jsonDecode(json));
  Serializer<CreateDocumentVariables> varsSerializer = (CreateDocumentVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateDocumentData, CreateDocumentVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateDocumentData, CreateDocumentVariables> ref() {
    CreateDocumentVariables vars= CreateDocumentVariables(tenantId: tenantId,businessId: businessId,title: title,documentType: documentType,fileUrl: fileUrl,uploadedBy: uploadedBy,);
    return _dataConnect.mutation("CreateDocument", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateDocumentDocumentInsert {
  final String id;
  CreateDocumentDocumentInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateDocumentDocumentInsert otherTyped = other as CreateDocumentDocumentInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateDocumentDocumentInsert({
    required this.id,
  });
}

@immutable
class CreateDocumentData {
  final CreateDocumentDocumentInsert document_insert;
  CreateDocumentData.fromJson(dynamic json):
  
  document_insert = CreateDocumentDocumentInsert.fromJson(json['document_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateDocumentData otherTyped = other as CreateDocumentData;
    return document_insert == otherTyped.document_insert;
    
  }
  @override
  int get hashCode => document_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['document_insert'] = document_insert.toJson();
    return json;
  }

  CreateDocumentData({
    required this.document_insert,
  });
}

@immutable
class CreateDocumentVariables {
  final String tenantId;
  final String businessId;
  final String title;
  final String documentType;
  final String fileUrl;
  final String uploadedBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateDocumentVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  title = nativeFromJson<String>(json['title']),
  documentType = nativeFromJson<String>(json['documentType']),
  fileUrl = nativeFromJson<String>(json['fileUrl']),
  uploadedBy = nativeFromJson<String>(json['uploadedBy']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateDocumentVariables otherTyped = other as CreateDocumentVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    title == otherTyped.title && 
    documentType == otherTyped.documentType && 
    fileUrl == otherTyped.fileUrl && 
    uploadedBy == otherTyped.uploadedBy;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, title.hashCode, documentType.hashCode, fileUrl.hashCode, uploadedBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['title'] = nativeToJson<String>(title);
    json['documentType'] = nativeToJson<String>(documentType);
    json['fileUrl'] = nativeToJson<String>(fileUrl);
    json['uploadedBy'] = nativeToJson<String>(uploadedBy);
    return json;
  }

  CreateDocumentVariables({
    required this.tenantId,
    required this.businessId,
    required this.title,
    required this.documentType,
    required this.fileUrl,
    required this.uploadedBy,
  });
}

