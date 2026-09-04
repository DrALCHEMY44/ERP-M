import 'api_service.dart';

class PlatformApi {
  static Future<Map<String, dynamic>> operation(
    String action, [
    Map<String, dynamic> input = const {},
  ]) async {
    final result = await ApiService.request(
      '/api/platform',
      method: 'POST',
      body: {'action': action, 'input': input},
      retryTransient:
          action == 'overview' ||
          action == 'tenant.details' ||
          action == 'users.list' ||
          action == 'user.details',
    );
    return result['data'] as Map<String, dynamic>? ?? const {};
  }
}
