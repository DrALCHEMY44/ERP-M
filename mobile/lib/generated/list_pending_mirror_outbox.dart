part of 'example.dart';

class ListPendingMirrorOutboxVariablesBuilder {
  final FirebaseDataConnect _dataConnect;
  ListPendingMirrorOutboxVariablesBuilder(this._dataConnect);
  Deserializer<ListPendingMirrorOutboxData> dataDeserializer = (dynamic json) =>
      ListPendingMirrorOutboxData.fromJson(jsonDecode(json));

  Future<QueryResult<ListPendingMirrorOutboxData, void>> execute({
    QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache,
  }) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListPendingMirrorOutboxData, void> ref() {
    return _dataConnect.query(
      "ListPendingMirrorOutbox",
      dataDeserializer,
      emptySerializer,
      null,
    );
  }
}

@immutable
class ListPendingMirrorOutboxMirrorOutboxes {
  final String id;
  final String tenantId;
  final String businessId;
  final String entityType;
  final String operation;
  final String recordId;
  final AnyValue payload;
  final String status;
  final int attempts;
  final Timestamp nextAttemptAt;
  final String? lastError;
  final Timestamp createdAt;
  ListPendingMirrorOutboxMirrorOutboxes.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']),
      tenantId = nativeFromJson<String>(json['tenantId']),
      businessId = nativeFromJson<String>(json['businessId']),
      entityType = nativeFromJson<String>(json['entityType']),
      operation = nativeFromJson<String>(json['operation']),
      recordId = nativeFromJson<String>(json['recordId']),
      payload = AnyValue.fromJson(json['payload']),
      status = nativeFromJson<String>(json['status']),
      attempts = nativeFromJson<int>(json['attempts']),
      nextAttemptAt = Timestamp.fromJson(json['nextAttemptAt']),
      lastError = json['lastError'] == null
          ? null
          : nativeFromJson<String>(json['lastError']),
      createdAt = Timestamp.fromJson(json['createdAt']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListPendingMirrorOutboxMirrorOutboxes otherTyped =
        other as ListPendingMirrorOutboxMirrorOutboxes;
    return id == otherTyped.id &&
        tenantId == otherTyped.tenantId &&
        businessId == otherTyped.businessId &&
        entityType == otherTyped.entityType &&
        operation == otherTyped.operation &&
        recordId == otherTyped.recordId &&
        payload == otherTyped.payload &&
        status == otherTyped.status &&
        attempts == otherTyped.attempts &&
        nextAttemptAt == otherTyped.nextAttemptAt &&
        lastError == otherTyped.lastError &&
        createdAt == otherTyped.createdAt;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    tenantId.hashCode,
    businessId.hashCode,
    entityType.hashCode,
    operation.hashCode,
    recordId.hashCode,
    payload.hashCode,
    status.hashCode,
    attempts.hashCode,
    nextAttemptAt.hashCode,
    lastError.hashCode,
    createdAt.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['tenantId'] = nativeToJson<String>(tenantId);
    json['businessId'] = nativeToJson<String>(businessId);
    json['entityType'] = nativeToJson<String>(entityType);
    json['operation'] = nativeToJson<String>(operation);
    json['recordId'] = nativeToJson<String>(recordId);
    json['payload'] = payload.toJson();
    json['status'] = nativeToJson<String>(status);
    json['attempts'] = nativeToJson<int>(attempts);
    json['nextAttemptAt'] = nextAttemptAt.toJson();
    if (lastError != null) {
      json['lastError'] = nativeToJson<String?>(lastError);
    }
    json['createdAt'] = createdAt.toJson();
    return json;
  }

  ListPendingMirrorOutboxMirrorOutboxes({
    required this.id,
    required this.tenantId,
    required this.businessId,
    required this.entityType,
    required this.operation,
    required this.recordId,
    required this.payload,
    required this.status,
    required this.attempts,
    required this.nextAttemptAt,
    this.lastError,
    required this.createdAt,
  });
}

@immutable
class ListPendingMirrorOutboxData {
  final List<ListPendingMirrorOutboxMirrorOutboxes> mirrorOutboxes;
  ListPendingMirrorOutboxData.fromJson(dynamic json)
    : mirrorOutboxes = (json['mirrorOutboxes'] as List<dynamic>)
          .map((e) => ListPendingMirrorOutboxMirrorOutboxes.fromJson(e))
          .toList();
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListPendingMirrorOutboxData otherTyped =
        other as ListPendingMirrorOutboxData;
    return mirrorOutboxes == otherTyped.mirrorOutboxes;
  }

  @override
  int get hashCode => mirrorOutboxes.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['mirrorOutboxes'] = mirrorOutboxes.map((e) => e.toJson()).toList();
    return json;
  }

  ListPendingMirrorOutboxData({required this.mirrorOutboxes});
}
