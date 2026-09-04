import 'api_service.dart';

class DataApi {
  static Future<Map<String, dynamic>> operation(
    String operation, [
    Map<String, dynamic> variables = const {},
  ]) async {
    final response = await ApiService.request(
      '/api/data',
      method: 'POST',
      body: {'operation': operation, 'variables': variables},
      retryTransient:
          operation.startsWith('list') || operation.startsWith('get'),
    );
    return (response['data'] as Map<String, dynamic>?) ?? const {};
  }
}
