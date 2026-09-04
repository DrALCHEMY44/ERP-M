import 'package:flutter/foundation.dart';

class ApiConfig {
  static const String _configuredBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
  );

  static String get baseUrl {
    final value = _configuredBaseUrl.trim();
    if (value.isEmpty) {
      if (const bool.fromEnvironment('dart.vm.product')) {
        throw StateError(
          'API_BASE_URL is required for release builds and must be an HTTPS URL.',
        );
      }
      // Chrome runs on the host machine; 10.0.2.2 is only the Android
      // emulator's alias for that host.
      return kIsWeb ? 'http://localhost:9002' : 'http://10.0.2.2:9002';
    }

    final uri = Uri.tryParse(value);
    if (uri == null || !uri.hasAuthority || !uri.hasScheme) {
      throw StateError('API_BASE_URL must be an absolute URL.');
    }
    if (const bool.fromEnvironment('dart.vm.product')) {
      if (uri.scheme != 'https') {
        throw StateError('Release API_BASE_URL must use HTTPS.');
      }
    } else if (uri.scheme != 'https' && uri.scheme != 'http') {
      throw StateError('Development API_BASE_URL must use HTTP or HTTPS.');
    }

    return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  }
}
