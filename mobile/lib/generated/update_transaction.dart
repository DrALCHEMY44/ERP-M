part of 'example.dart';

class UpdateTransactionVariablesBuilder {
  String id;
  Optional<String> _tenantId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _businessId = Optional.optional(nativeFromJson, nativeToJson);
  Optional<TransactionType> _type = Optional.optional((data) => TransactionType.values.byName(data), enumSerializer);
  Optional<double> _amount = Optional.optional(nativeFromJson, nativeToJson);
  Optional<Timestamp> _date = Optional.optional((json) => json['date'] = Timestamp.fromJson(json['date']), defaultSerializer);
  Optional<String> _category = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _receiptUrl = Optional.optional(nativeFromJson, nativeToJson);
  Optional<String> _recordedBy = Optional.optional(nativeFromJson, nativeToJson);

  final FirebaseDataConnect _dataConnect;  UpdateTransactionVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder type(TransactionType? t) {
   _type.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder amount(double? t) {
   _amount.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder date(Timestamp? t) {
   _date.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder receiptUrl(String? t) {
   _receiptUrl.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder recordedBy(String? t) {
   _recordedBy.value = t;
   return this;
  }

  UpdateTransactionVariablesBuilder(this._dataConnect, {required  this.id,});
  Deserializer<UpdateTransactionData> dataDeserializer = (dynamic json)  => UpdateTransactionData.fromJson(jsonDecode(json));
  Serializer<UpdateTransactionVariables> varsSerializer = (UpdateTransactionVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateTransactionData, UpdateTransactionVariables>> execute() {
    return ref().execute();
  }

  MutationRef<UpdateTransactionData, UpdateTransactionVariables> ref() {
    UpdateTransactionVariables vars= UpdateTransactionVariables(id: id,tenantId: _tenantId,businessId: _businessId,type: _type,amount: _amount,date: _date,category: _category,receiptUrl: _receiptUrl,recordedBy: _recordedBy,);
    return _dataConnect.mutation("UpdateTransaction", dataDeserializer, varsSerializer, vars);
  }
}

@immutable
class UpdateTransactionTransactionUpdate {
  final String id;
  UpdateTransactionTransactionUpdate.fromJson(dynamic json):
  
  id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTransactionTransactionUpdate otherTyped = other as UpdateTransactionTransactionUpdate;
    return id == otherTyped.id;
    
  }
  @override
  int get hashCode => id.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateTransactionTransactionUpdate({
    required this.id,
  });
}

@immutable
class UpdateTransactionData {
  final UpdateTransactionTransactionUpdate? transaction_update;
  UpdateTransactionData.fromJson(dynamic json):
  
  transaction_update = json['transaction_update'] == null ? null : UpdateTransactionTransactionUpdate.fromJson(json['transaction_update']);
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTransactionData otherTyped = other as UpdateTransactionData;
    return transaction_update == otherTyped.transaction_update;
    
  }
  @override
  int get hashCode => transaction_update.hashCode;
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (transaction_update != null) {
      json['transaction_update'] = transaction_update!.toJson();
    }
    return json;
  }

  UpdateTransactionData({
    this.transaction_update,
  });
}

@immutable
class UpdateTransactionVariables {
  final String id;
  late final Optional<String>tenantId;
  late final Optional<String>businessId;
  late final Optional<TransactionType>type;
  late final Optional<double>amount;
  late final Optional<Timestamp>date;
  late final Optional<String>category;
  late final Optional<String>receiptUrl;
  late final Optional<String>recordedBy;
  @Deprecated('fromJson is deprecated for Variable classes as they are no longer required for deserialization.')
  UpdateTransactionVariables.fromJson(Map<String, dynamic> json):
  
  id = nativeFromJson<String>(json['id']) {
  
  
  
    tenantId = Optional.optional(nativeFromJson, nativeToJson);
    tenantId.value = json['tenantId'] == null ? null : nativeFromJson<String>(json['tenantId']);
  
  
    businessId = Optional.optional(nativeFromJson, nativeToJson);
    businessId.value = json['businessId'] == null ? null : nativeFromJson<String>(json['businessId']);
  
  
    type = Optional.optional((data) => TransactionType.values.byName(data), enumSerializer);
    type.value = json['type'] == null ? null : TransactionType.values.byName(json['type']);
  
  
    amount = Optional.optional(nativeFromJson, nativeToJson);
    amount.value = json['amount'] == null ? null : nativeFromJson<double>(json['amount']);
  
  
    date = Optional.optional((json) => json['date'] = Timestamp.fromJson(json['date']), defaultSerializer);
    date.value = json['date'] == null ? null : Timestamp.fromJson(json['date']);
  
  
    category = Optional.optional(nativeFromJson, nativeToJson);
    category.value = json['category'] == null ? null : nativeFromJson<String>(json['category']);
  
  
    receiptUrl = Optional.optional(nativeFromJson, nativeToJson);
    receiptUrl.value = json['receiptUrl'] == null ? null : nativeFromJson<String>(json['receiptUrl']);
  
  
    recordedBy = Optional.optional(nativeFromJson, nativeToJson);
    recordedBy.value = json['recordedBy'] == null ? null : nativeFromJson<String>(json['recordedBy']);
  
  }
  @override
  bool operator ==(Object other) {
    if(identical(this, other)) {
      return true;
    }
    if(other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateTransactionVariables otherTyped = other as UpdateTransactionVariables;
    return id == otherTyped.id && 
    tenantId == otherTyped.tenantId && 
    businessId == otherTyped.businessId && 
    type == otherTyped.type && 
    amount == otherTyped.amount && 
    date == otherTyped.date && 
    category == otherTyped.category && 
    receiptUrl == otherTyped.receiptUrl && 
    recordedBy == otherTyped.recordedBy;
    
  }
  @override
  int get hashCode => Object.hashAll([id.hashCode, tenantId.hashCode, businessId.hashCode, type.hashCode, amount.hashCode, date.hashCode, category.hashCode, receiptUrl.hashCode, recordedBy.hashCode]);
  

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if(tenantId.state == OptionalState.set) {
      json['tenantId'] = tenantId.toJson();
    }
    if(businessId.state == OptionalState.set) {
      json['businessId'] = businessId.toJson();
    }
    if(type.state == OptionalState.set) {
      json['type'] = type.toJson();
    }
    if(amount.state == OptionalState.set) {
      json['amount'] = amount.toJson();
    }
    if(date.state == OptionalState.set) {
      json['date'] = date.toJson();
    }
    if(category.state == OptionalState.set) {
      json['category'] = category.toJson();
    }
    if(receiptUrl.state == OptionalState.set) {
      json['receiptUrl'] = receiptUrl.toJson();
    }
    if(recordedBy.state == OptionalState.set) {
      json['recordedBy'] = recordedBy.toJson();
    }
    return json;
  }

  UpdateTransactionVariables({
    required this.id,
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

