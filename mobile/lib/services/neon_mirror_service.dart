import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'auth_service.dart';

class NeonMirrorService {
  static const String _apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:9002',
  );

  static Future<void> mirror({
    required String entity,
    required String operation,
    required String recordId,
    required Map<String, dynamic> payload,
  }) async {
    try {
      final firebaseUser = FirebaseAuth.instance.currentUser;
      final appUser = AuthService.currentUser;
      if (firebaseUser == null || appUser == null) return;
      final token = await firebaseUser.getIdToken();
      final response = await http.post(
        Uri.parse('$_apiBaseUrl/api/sync/neon'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': appUser.tenantId,
          'X-Business-Id': appUser.businessId,
        },
        body: jsonEncode({
          'entity': entity,
          'operation': operation,
          'recordId': recordId,
          'payload': {
            ...payload,
            'id': recordId,
            'tenantId': appUser.tenantId,
            'businessId': appUser.businessId,
          },
        }),
      );
      if (response.statusCode < 200 || response.statusCode >= 300) {
        debugPrint('Neon mirror returned ${response.statusCode}');
      }
    } catch (error) {
      // Firebase SQL Connect is primary; do not repeat a successful primary write.
      debugPrint('Neon mirror failed after Firebase write: $error');
    }
  }
}
