import 'package:flutter/foundation.dart' show debugPrint;
import 'package:firebase_core/firebase_core.dart';

class DatabaseService {
  static Future<void> initFirebase() async {
    try {
      if (Firebase.apps.isEmpty) {
        // Android configuration is supplied by the dedicated demo project's
        // google-services.json. No project identifier is embedded in Dart.
        await Firebase.initializeApp();
      }
      debugPrint('Firebase initialized from platform configuration.');
    } catch (e) {
      debugPrint('Firebase initialization error: $e');
      rethrow;
    }
  }
}
