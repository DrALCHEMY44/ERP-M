part of 'example.dart';

class ClearLegacyAccessCodeVariablesBuilder {
  String id;

  final FirebaseDataConnect _dataConnect;
  ClearLegacyAccessCodeVariablesBuilder(this._dataConnect, {required this.id});
  Deserializer<ClearLegacyAccessCodeData> dataDeserializer = (dynamic json) =>
      ClearLegacyAccessCodeData.fromJson(jsonDecode(json));
  Serializer<ClearLegacyAccessCodeVariables> varsSerializer =
      (ClearLegacyAccessCodeVariables vars) => jsonEncode(vars.toJson());
  Future<
    OperationResult<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables>
  >
  execute() {
    return ref().execute();
  }

  MutationRef<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables> ref() {
    ClearLegacyAccessCodeVariables vars = ClearLegacyAccessCodeVariables(
      id: id,
    );
    return _dataConnect.mutation(
      "ClearLegacyAccessCode",
      dataDeserializer,
      varsSerializer,
      vars,
    );
  }
}

@immutable
class ClearLegacyAccessCodeUserUpdate {
  final String id;
  ClearLegacyAccessCodeUserUpdate.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ClearLegacyAccessCodeUserUpdate otherTyped =
        other as ClearLegacyAccessCodeUserUpdate;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  ClearLegacyAccessCodeUserUpdate({required this.id});
}

@immutable
class ClearLegacyAccessCodeData {
  final ClearLegacyAccessCodeUserUpdate? user_update;
  ClearLegacyAccessCodeData.fromJson(dynamic json)
    : user_update = json['user_update'] == null
          ? null
          : ClearLegacyAccessCodeUserUpdate.fromJson(json['user_update']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ClearLegacyAccessCodeData otherTyped =
        other as ClearLegacyAccessCodeData;
    return user_update == otherTyped.user_update;
  }

  @override
  int get hashCode => user_update.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    if (user_update != null) {
      json['user_update'] = user_update!.toJson();
    }
    return json;
  }

  ClearLegacyAccessCodeData({this.user_update});
}

@immutable
class ClearLegacyAccessCodeVariables {
  final String id;
  @Deprecated(
    'fromJson is deprecated for Variable classes as they are no longer required for deserialization.',
  )
  ClearLegacyAccessCodeVariables.fromJson(Map<String, dynamic> json)
    : id = nativeFromJson<String>(json['id']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ClearLegacyAccessCodeVariables otherTyped =
        other as ClearLegacyAccessCodeVariables;
    return id == otherTyped.id;
  }

  @override
  int get hashCode => id.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    return json;
  }

  ClearLegacyAccessCodeVariables({required this.id});
}
