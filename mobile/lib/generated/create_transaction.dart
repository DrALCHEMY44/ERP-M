part of 'example.dart';

class CreateTransactionVariablesBuilder {
  String tenantId;
  String businessId;
  TransactionType type;
  double amount;
  Timestamp date;
  Optional<String> _category = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _receiptUrl = Optional.optional(nativeFromJson, nativeToJson);
  String recordedBy;

  final FirebaseDataConnect _dataConnect;  CreateTransactionVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  CreateTransactionVariablesBuilder receiptUrl(String? t) {
   _receiptUrl.value = t;
   return this;
  }

  CreateTransactionVariablesBuilder(this._dataConnect, {required  this.tenantId,required  this.businessId,required  this.type,required  this.amount,required  this.date,required  this.recordedBy,});
  Deserializer<CreateTransactionData> dataDeserializer = (dynamic json)  => CreateTransactionData.fromJson(jsonDecode(json));
  Serializer<CreateTransactionVariables> varsSerializer = (CreateTransactionVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<CreateTransactionData, CreateTransactionVariables>> execute() {
    return ref().execute();
  }

  MutationRef<CreateTransactionData, CreateTransactionVariables> ref() {
    CreateTransactionVariables vars= CreateTransactionVariables(tenantId: tenantId,businessId: businessId,type: type,amount: amount,date: date,category: _category,receiptUrl: _receiptUrl,recordedBy: recordedBy,);
    return _dataConnect.mutation("CreateTransaction", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class CreateTransactionTransactionInsert {
  final String id;
  CreateTransactionTransactionInsert.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTransactionTransactionInsert otherTyped = other as CreateTransactionTransactionInsert;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  CreateTransactionTransactionInsert({
    required this.id,
  });
}

@immutable
class CreateTransactionData {
  final CreateTransactionTransactionInsert transaction_insert;
  CreateTransactionData.fromJson(dynamic json):
  
  transaction_insert = CreateTransactionTransactionInsert.fromJson(json['transaction_insert']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTransactionData otherTyped = other as CreateTransactionData;
    return transaction_insert == otherTyped.transaction_insert;
    
  }
  @override
  int get hashCode => transaction_insert.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['transaction_insert'] = transaction_insert.toJson();
    return json;
  }

  CreateTransactionData({
    required this.transaction_insert,
  });
}

@immutable
class CreateTransactionVariables {
  final String tenantId;
  final String businessId;
  final TransactionType type;
  final double amount;
  final Timestamp date;
  late final Optional<String>category;
  late final Optional<String>receiptUrl;
  final String recordedBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  CreateTransactionVariables.fromJson(Map<String, dynamic> json):
  
  tenantId = nativeFromJson<String>(json['tenantId']),
  businessId = nativeFromJson<String>(json['businessId']),
  type = TransactionType.values.byName(json['type']),
  amount = nativeFromJson<double>(json['amount']),
  date = Timestamp.fromJson(json['date']),
  recordedBy = nativeFromJson<String>(json['recordedBy']) {
  
  
  
  
  
  
  
    category = Optional.optional(nativeFromJson, nativeToJson);
    category.value = json['category'] == null ? null : nativeFromJson<String>(json['category']);
  
  
    receiptUrl = Optional.optional(nativeFromJson, nativeToJson);
    receiptUrl.value = json['receiptUrl'] == null ? null : nativeFromJson<String>(json['receiptUrl']);
  
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final CreateTransactionVariables otherTyped = other as CreateTransactionVariables;
    return tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    type == otherTyped.type && 
    amount == otherTyped.amount && 
    date == otherTyped.date && 
    category == otherTyped.category && 
    receiptUrl == otherTyped.receiptUrl && 
    recordedBy == otherTyped.recordedBy;
    
  }
  @override
  int get hashCode => Object.hashAll([tenantId.hashCode, businessId.hashCode, type.hashCode, amount.hashCode, date.hashCode, category.hashCode, receiptUrl.hashCode, recordedBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['type'] = 
    type.name
    ;
    json['amount'] = nativeToJson<double>(amount);
    json['date'] = date.toJson();
    if(category.state == OptionalState.set) {
      json['category'] = category.toJson();
    }
    if(receiptUrl.state == OptionalState.set) {
      json['receiptUrl'] = receiptUrl.toJson();
    }
    json['recordedBy'] = nativeToJson<String>(recordedBy);
    return json;
  }

  CreateTransactionVariables({
    required this.tenantId,
    required this.businessId,
    required this.type,
    required this.amount,
    required this.date,
    required this.category,
    required this.receiptUrl,
    required this.recordedBy,
  });
}

