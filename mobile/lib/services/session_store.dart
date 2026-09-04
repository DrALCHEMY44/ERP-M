import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SessionStore {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'smarterp_session_token';

  static Future<String?> readToken() => _storage.read(key: _tokenKey);

  static Future<void> writeToken(String token) =>
      _storage.write(key: _tokenKey, value: token);

  static Future<void> clear() => _storage.delete(key: _tokenKey);
}
