part of 'example.dart';

class ListDocumentsByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListDocumentsByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListDocumentsByBusinessData> dataDeserializer = (dynamic json)  => ListDocumentsByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListDocumentsByBusinessVariables> varsSerializer = (ListDocumentsByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables> ref() {
    ListDocumentsByBusinessVariables vars= ListDocumentsByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listDocumentsByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListDocumentsByBusinessDocuments {
  final String id;
  final String title;
  final String documentType;
  final String fileUrl;
  final String uploadedBy;
  final Timestamp uploadedAt;
  final String tenantId;
  final String businessId;
  ListDocumentsByBusinessDocuments.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  title = nativeFromJson<String>(json['title']),
  documentType = nativeFromJson<String>(json['documentType']),
  fileUrl = nativeFromJson<String>(json['fileUrl']),
  uploadedBy = nativeFromJson<String>(json['uploadedBy']),
  uploadedAt = Timestamp.fromJson(json['uploadedAt']),
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListDocumentsByBusinessDocuments otherTyped = other as ListDocumentsByBusinessDocuments;
    return id == otherTyped.id && 
    title == otherTyped.title && 
    documentType == otherTyped.documentType && 
    fileUrl == otherTyped.fileUrl && 
    uploadedBy == otherTyped.uploadedBy && 
    uploadedAt == otherTyped.uploadedAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, title.hashCode, documentType.hashCode, fileUrl.hashCode, uploadedBy.hashCode, uploadedAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['title'] = nativeToJson<String>(title);
    json['documentType'] = nativeToJson<String>(documentType);
    json['fileUrl'] = nativeToJson<String>(fileUrl);
    json['uploadedBy'] = nativeToJson<String>(uploadedBy);
    json['uploadedAt'] = uploadedAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListDocumentsByBusinessDocuments({
    required this.id,
    required this.title,
    required this.documentType,
    required this.fileUrl,
    required this.uploadedBy,
    required this.uploadedAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListDocumentsByBusinessData {
  final List<ListDocumentsByBusinessDocuments> documents;
  ListDocumentsByBusinessData.fromJson(dynamic json):
  
  documents = (json['documents'] as List<dynamic>)
        .map((e) => ListDocumentsByBusinessDocuments.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListDocumentsByBusinessData otherTyped = other as ListDocumentsByBusinessData;
    return documents == otherTyped.documents;
    
  }
  @override
  int get hashCode => documents.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['documents'] = documents.map((e) => e.toJson()).toList();
    return json;
  }

  ListDocumentsByBusinessData({
    required this.documents,
  });
}

@immutable
class ListDocumentsByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListDocumentsByBusinessVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListDocumentsByBusinessVariables otherTyped = other as ListDocumentsByBusinessVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListDocumentsByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

