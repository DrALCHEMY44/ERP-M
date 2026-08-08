part of 'example.dart';

class ListTransactionsByTypeVariablesBuilder {
  String tenantId;
  String businessId;
  TransactionType type;

  final FirebaseDataConnect _dataConnect;
  ListTransactionsByTypeVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.type,});
  Deserializer<ListTransactionsByTypeData> dataDeserializer = (dynamic json)  => ListTransactionsByTypeData.fromJson(jsonDecode(json));
  Serializer<ListTransactionsByTypeVariables> varsSerializer = (ListTransactionsByTypeVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListTransactionsByTypeData, ListTransactionsByTypeVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListTransactionsByTypeData, ListTransactionsByTypeVariables> ref() {
    ListTransactionsByTypeVariables vars= ListTransactionsByTypeVariables(tenantId: tenantId,businessId: businessId,type: type,);
    return _dataConnect.query("listTransactionsByType", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListTransactionsByTypeTransactions {
  final String id;
  final EnumValue<TransactionType> type;
  final double amount;
  final Timestamp date;
  final String? category;
  final String? receiptUrl;
  final String recordedBy;
  final Timestamp createdAt;
  final String tenantId;
  final String businessId;
  ListTransactionsByTypeTransactions.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']),
  type = transactionTypeDeserializer(json['type']),
  amount = nativeFromJson<double>(json['amount']),
  date = Timestamp.fromJson(json['date']),
  category = json['category'] == null ? null : nativeFromJson<String>(json['category']),
  receiptUrl = json['receiptUrl'] == null ? null : nativeFromJson<String>(json['receiptUrl']),
  recordedBy = nativeFromJson<String>(json['recordedBy']),
  createdAt = Timestamp.fromJson(json['createdAt']),
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

    final ListTransactionsByTypeTransactions otherTyped = other as ListTransactionsByTypeTransactions;
    return id == otherTyped.id && 
    type == otherTyped.type && 
    amount == otherTyped.amount && 
    date == otherTyped.date && 
    category == otherTyped.category && 
    receiptUrl == otherTyped.receiptUrl && 
    recordedBy == otherTyped.recordedBy && 
    createdAt == otherTyped.createdAt && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, type.hashCode, amount.hashCode, date.hashCode, category.hashCode, receiptUrl.hashCode, recordedBy.hashCode, createdAt.hashCode, tenantId.hashCode, businessId.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['type'] = 
    transactionTypeSerializer(type)
    ;
    json['amount'] = nativeToJson<double>(amount);
    json['date'] = date.toJson();
    if (category != null) {
      json['category'] = nativeToJson<String?>(category);
    }
    if (receiptUrl != null) {
      json['receiptUrl'] = nativeToJson<String?>(receiptUrl);
    }
    json['recordedBy'] = nativeToJson<String>(recordedBy);
    json['createdAt'] = createdAt.toJson();
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    return json;
  }

  ListTransactionsByTypeTransactions({
    required this.id,
    required this.type,
    required this.amount,
    required this.date,
    this.category,
    this.receiptUrl,
    required this.recordedBy,
    required this.createdAt,
    required this.tenantId,
    required this.businessId,
  });
}

@immutable
class ListTransactionsByTypeData {
  final List<ListTransactionsByTypeTransactions> transactions;
  ListTransactionsByTypeData.fromJson(dynamic json):
  
  transactions = (json['transactions'] as List<dynamic>)
        .map((e) => ListTransactionsByTypeTransactions.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTransactionsByTypeData otherTyped = other as ListTransactionsByTypeData;
    return transactions == otherTyped.transactions;
    
  }
  @override
  int get hashCode => transactions.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['transactions'] = transactions.map((e) => e.toJson()).toList();
    return json;
  }

  ListTransactionsByTypeData({
    required this.transactions,
  });
}

@immutable
class ListTransactionsByTypeVariables {
  final String tenantId;
  final String businessId;
  final TransactionType type;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListTransactionsByTypeVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  type = TransactionType.values.byName(json['type']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTransactionsByTypeVariables otherTyped = other as ListTransactionsByTypeVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    type == otherTyped.type;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, type.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['type'] = 
    type.name
    ;
    return json;
  }

  ListTransactionsByTypeVariables({
    required this.tenantId,
    required this.businessId,
    required this.type,
  });
}

