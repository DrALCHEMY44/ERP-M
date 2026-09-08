import 'package:flutter/foundation.dart';

class ApiConfig {
  static const String _productionBaseUrl = 'https://erp-m.vercel.app';

  static const String _configuredBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
  );

  static String get baseUrl {
    final value = _configuredBaseUrl.trim();
    if (value.isEmpty) {
      // A normal Flutter run on a physical phone must work without silently
      // targeting the Android emulator's host alias (10.0.2.2). Web debug
      // keeps using the local Next.js server; native builds use production.
      return kIsWeb && !const bool.fromEnvironment('dart.vm.product')
          ? 'http://localhost:9002'
          : _productionBaseUrl;
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
