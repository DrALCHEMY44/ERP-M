part of 'example.dart';

class ListTenantsVariablesBuilder {
  
  final FirebaseDataConnect _dataConnect;
  ListTenantsVariablesBuilder(this._dataConnect, );
  Deserializer<ListTenantsData> dataDeserializer = (dynamic json)  => ListTenantsData.fromJson(jsonDecode(json));
  
  Future<QueryResult<ListTenantsData, void>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListTenantsData, void> ref() {
    
    return _dataConnect.query("ListTenants", dataDeserializer, emptySerializer, null);
  }
}

@immutable
class ListTenantsTenants {
  final String id;
  final String name;
  final String businessSector;
  final String location;
  final String ownerEmail;
  final String? taxId;
  final String? logoUrl;
  final String? subscriptionTier;
  final String? status;
  final Timestamp createdAt;
  ListTenantsTenants.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  name = nativeFromJson<String>(json['name']),
  businessSector = nativeFromJson<String>(json['businessSector']),
  location = nativeFromJson<String>(json['location']),
  ownerEmail = nativeFromJson<String>(json['ownerEmail']),
  taxId = json['taxId'] == null ? null : nativeFromJson<String>(json['taxId']),
  logoUrl = json['logoUrl'] == null ? null : nativeFromJson<String>(json['logoUrl']),
  subscriptionTier = json['subscriptionTier'] == null ? null : nativeFromJson<String>(json['subscriptionTier']),
  status = json['status'] == null ? null : nativeFromJson<String>(json['status']),
  createdAt = Timestamp.fromJson(json['createdAt']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTenantsTenants otherTyped = other as ListTenantsTenants;
    return id == otherTyped.id && 
    name == otherTyped.name && 
    businessSector == otherTyped.businessSector && 
    location == otherTyped.location && 
    ownerEmail == otherTyped.ownerEmail && 
    taxId == otherTyped.taxId && 
    logoUrl == otherTyped.logoUrl && 
    subscriptionTier == otherTyped.subscriptionTier && 
    status == otherTyped.status && 
    createdAt == otherTyped.createdAt;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, name.hashCode, businessSector.hashCode, location.hashCode, ownerEmail.hashCode, taxId.hashCode, logoUrl.hashCode, subscriptionTier.hashCode, status.hashCode, createdAt.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['name'] = nativeToJson<String>(name);
    json['businessSector'] = nativeToJson<String>(businessSector);
    json['location'] = nativeToJson<String>(location);
    json['ownerEmail'] = nativeToJson<String>(ownerEmail);
    if (taxId != null) {
      json['taxId'] = nativeToJson<String?>(taxId);
    }
    if (logoUrl != null) {
      json['logoUrl'] = nativeToJson<String?>(logoUrl);
    }
    if (subscriptionTier != null) {
      json['subscriptionTier'] = nativeToJson<String?>(subscriptionTier);
    }
    if (status != null) {
      json['status'] = nativeToJson<String?>(status);
    }
    json['createdAt'] = createdAt.toJson();
    return json;
  }

  ListTenantsTenants({
    required this.id,
    required this.name,
    required this.businessSector,
    required this.location,
    required this.ownerEmail,
    this.taxId,
    this.logoUrl,
    this.subscriptionTier,
    this.status,
    required this.createdAt,
  });
}

@immutable
class ListTenantsData {
  final List<ListTenantsTenants> tenants;
  ListTenantsData.fromJson(dynamic json):
  
  tenants = (json['tenants'] as List<dynamic>)
        .map((e) => ListTenantsTenants.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTenantsData otherTyped = other as ListTenantsData;
    return tenants == otherTyped.tenants;
    
  }
  @override
  int get hashCode => tenants.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenants'] = tenants.map((e) => e.toJson()).toList();
    return json;
  }

  ListTenantsData({
    required this.tenants,
  });
}

