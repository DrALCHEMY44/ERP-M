part of 'example.dart';

class ListLegacyAccessCodesVariablesBuilder {
  final FirebaseDataConnect _dataConnect;
  ListLegacyAccessCodesVariablesBuilder(this._dataConnect);
  Deserializer<ListLegacyAccessCodesData> dataDeserializer = (dynamic json) =>
      ListLegacyAccessCodesData.fromJson(jsonDecode(json));

  Future<QueryResult<ListLegacyAccessCodesData, void>> execute({
    QueryFetchPolicy fetchPolicy = QueryFetchPolicy.preferCache,
  }) {
    return ref().execute(fetchPolicy: fetchPolicy);
  }

  QueryRef<ListLegacyAccessCodesData, void> ref() {
    return _dataConnect.query(
      "ListLegacyAccessCodes",
      dataDeserializer,
      emptySerializer,
      null,
    );
  }
}

@immutable
class ListLegacyAccessCodesUsers {
  final String id;
  final String? accessCode;
  ListLegacyAccessCodesUsers.fromJson(dynamic json)
    : id = nativeFromJson<String>(json['id']),
      accessCode = json['accessCode'] == null
          ? null
          : nativeFromJson<String>(json['accessCode']);
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListLegacyAccessCodesUsers otherTyped =
        other as ListLegacyAccessCodesUsers;
    return id == otherTyped.id && accessCode == otherTyped.accessCode;
  }

  @override
  int get hashCode => Object.hashAll([id.hashCode, accessCode.hashCode]);

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['id'] = nativeToJson<String>(id);
    if (accessCode != null) {
      json['accessCode'] = nativeToJson<String?>(accessCode);
    }
    return json;
  }

  ListLegacyAccessCodesUsers({required this.id, this.accessCode});
}

@immutable
class ListLegacyAccessCodesData {
  final List<ListLegacyAccessCodesUsers> users;
  ListLegacyAccessCodesData.fromJson(dynamic json)
    : users = (json['users'] as List<dynamic>)
          .map((e) => ListLegacyAccessCodesUsers.fromJson(e))
          .toList();
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }

    final ListLegacyAccessCodesData otherTyped =
        other as ListLegacyAccessCodesData;
    return users == otherTyped.users;
  }

  @override
  int get hashCode => users.hashCode;

  Map<String, dynamic> toJson() {
    Map<String, dynamic> json = {};
    json['users'] = users.map((e) => e.toJson()).toList();
    return json;
  }

  ListLegacyAccessCodesData({required this.users});
}
