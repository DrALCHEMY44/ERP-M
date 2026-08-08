part of 'example.dart';

class ListTransactionsByBusinessVariablesBuilder {
  String tenantId;
  String businessId;

  final FirebaseDataConnect _dataConnect;
  ListTransactionsByBusinessVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,});
  Deserializer<ListTransactionsByBusinessData> dataDeserializer = (dynamic json)  => ListTransactionsByBusinessData.fromJson(jsonDecode(json));
  Serializer<ListTransactionsByBusinessVariables> varsSerializer = (ListTransactionsByBusinessVariables vars) => jsonEncode(vars.toJson());
  Future<QueryResult<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>> execute({QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache}) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables> ref() {
    ListTransactionsByBusinessVariables vars= ListTransactionsByBusinessVariables(tenantId: tenantId,businessId: businessId,);
    return _dataConnect.query("listTransactionsByBusiness", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class ListTransactionsByBusinessTransactions {
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
  ListTransactionsByBusinessTransactions.fromJson(dynamic json):
  
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

    final ListTransactionsByBusinessTransactions otherTyped = other as ListTransactionsByBusinessTransactions;
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

  ListTransactionsByBusinessTransactions({
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
class ListTransactionsByBusinessData {
  final List<ListTransactionsByBusinessTransactions> transactions;
  ListTransactionsByBusinessData.fromJson(dynamic json):
  
  transactions = (json['transactions'] as List<dynamic>)
        .map((e) => ListTransactionsByBusinessTransactions.fromJson(e))
        .toList();
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final ListTransactionsByBusinessData otherTyped = other as ListTransactionsByBusinessData;
    return transactions == otherTyped.transactions;
    
  }
  @override
  int get hashCode => transactions.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['transactions'] = transactions.map((e) => e.toJson()).toList();
    return json;
  }

  ListTransactionsByBusinessData({
    required this.transactions,
  });
}

@immutable
class ListTransactionsByBusinessVariables {
  final String tenantId;
  final String businessId;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  ListTransactionsByBusinessVariables.fromJson(Map<String, dynamic> json):
  
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

    final ListTransactionsByBusinessVariables otherTyped = other as ListTransactionsByBusinessVariables;
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

  ListTransactionsByBusinessVariables({
    required this.tenantId,
    required this.businessId,
  });
}

