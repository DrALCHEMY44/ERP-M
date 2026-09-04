part of 'example.dart';

class UpdateMirrorOutboxVariablesBuilder {
  String id;
  String status;
  int attempts;
  Timestamp nextAttemptAt;
  Optional<String> _lastError = Optional.optional(nativeFromJson, nativeToJson);
  Optional<Timestamp> _deliveredAt = Optional.optional(
    (json) => json['deliveredAt'] = Timestamp.fromJson(json['deliveredAt']),
    defaultSerializer,
  );

  final FirebaseDataConnect _dataConnect;
  UpdateMirrorOutboxVariablesBuilder lastError(String? t) {
    _lastError.value = t;
    return this;
  }

  UpdateMirrorOutboxVariablesBuilder deliveredAt(Timestamp? t) {
    _deliveredAt.value = t;
    return this;
  }

  UpdateMirrorOutboxVariablesBuilder(
    this._dataConnect, {
    required this.id,
    required this.status,
    required this.attempts,
    required this.nextAttemptAt,
  });
  Deserializer<UpdateMirrorOutboxData> dataDeserializer = (dynamic json) =>
      UpdateMirrorOutboxData.fromJson(jsonDecode(json));
  Serializer<UpdateMirrorOutboxVariables> varsSerializer =
      (UpdateMirrorOutboxVariables vars) => jsonEncode(vars.toJson());
  Future<OperationResult<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables>>
  execute() {
    return ref().execute();
  }

  MutationRef<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables> ref() {
    UpdateMirrorOutboxVariables vars = UpdateMirrorOutboxVariables(
      id: id,
      status: status,
      attempts: attempts,
      nextAttemptAt: nextAttemptAt,
      lastError: _lastError,
      deliveredAt: _deliveredAt,
    );
    return _dataConnect.mutation(
      "UpdateMirrorOutbox",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class UpdateMirrorOutboxMirrorOutboxUpdate {
  final String id;
  UpdateMirrorOutboxMirrorOutboxUpdate.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateMirrorOutboxMirrorOutboxUpdate otherTyped =
        other as UpdateMirrorOutboxMirrorOutboxUpdate;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  UpdateMirrorOutboxMirrorOutboxUpdate({required this.id});
}

@immutable
class UpdateMirrorOutboxData {
  final UpdateMirrorOutboxMirrorOutboxUpdate? mirrorOutbox_update;
  UpdateMirrorOutboxData.fromJson(dynamic json)
    : mirrorOutbox_update = json['mirrorOutbox_update'] == null
          ? null
          : UpdateMirrorOutboxMirrorOutboxUpdate.fromJson(
              json['mirrorOutbox_update'],
            );
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateMirrorOutboxData otherTyped = other as UpdateMirrorOutboxData;
    return mirrorOutbox_update == otherTyped.mirrorOutbox_update;
  }

  @override
  int get hashCode => mirrorOutbox_update.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (mirrorOutbox_update != null) {
      json['mirrorOutbox_update'] = mirrorOutbox_update!.toJson();
    }
    return json;
  }

  UpdateMirrorOutboxData({this.mirrorOutbox_update});
}

@immutable
class UpdateMirrorOutboxVariables {
  final String id;
  final String status;
  final int attempts;
  final Timestamp nextAttemptAt;
  late final Optional<String> lastError;
  late final Optional<Timestamp> deliveredAt;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  UpdateMirrorOutboxVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']),
      status = nativeFromJson<String>(json['status']),
      attempts = nativeFromJson<int>(json['attempts']),
      nextAttemptAt = Timestamp.fromJson(json['nextAttemptAt']) {
    lastError = Optional.optional(nativeFromJson, nativeToJson);
    lastError.value = json['lastError'] == null
        ? null
        : nativeFromJson<String>(json['lastError']);

    deliveredAt = Optional.optional(
      (json) => json['deliveredAt'] = Timestamp.fromJson(json['deliveredAt']),
      defaultSerializer,
    );
    deliveredAt.value = json['deliveredAt'] == null
        ? null
        : Timestamp.fromJson(json['deliveredAt']);
  }
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final UpdateMirrorOutboxVariables otherTyped =
        other as UpdateMirrorOutboxVariables;
    return id == otherTyped.id &&
        status == otherTyped.status &&
        attempts == otherTyped.attempts &&
        nextAttemptAt == otherTyped.nextAttemptAt &&
        lastError == otherTyped.lastError &&
        deliveredAt == otherTyped.deliveredAt;
  }

  @override
  int get hashCode => Object.hashAll([
    id.hashCode,
    status.hashCode,
    attempts.hashCode,
    nextAttemptAt.hashCode,
    lastError.hashCode,
    deliveredAt.hashCode,
  ]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    json['status'] = nativeToJson<String>(status);
    json['attempts'] = nativeToJson<int>(attempts);
    json['nextAttemptAt'] = nextAttemptAt.toJson();
    if (lastError.state == OptionalState.set) {
      json['lastError'] = lastError.toJson();
    }
    if (deliveredAt.state == OptionalState.set) {
      json['deliveredAt'] = deliveredAt.toJson();
    }
    return json;
  }

  UpdateMirrorOutboxVariables({
    required this.id,
    required this.status,
    required this.attempts,
    required this.nextAttemptAt,
    required this.lastError,
    required this.deliveredAt,
  });
}
