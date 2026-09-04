import 'api_service.dart';

/// Shared Neon-backed HR, payroll, and accounting API used by mobile.
/// Tenant, company, and actor identifiers are derived by the server session.
class EnterpriseApi {
  static Future<Map<String, dynamic>> hr() => ApiService.request('/api/hr');
  static Future<Map<String, dynamic>> payroll() =>
      ApiService.request('/api/payroll');
  static Future<Map<String, dynamic>> accounting({
    String? throughDate,
  }) => ApiService.request(
    '/api/accounting${throughDate == null ? '' : '?throughDate=$throughDate'}',
  );

  static Future<Map<String, dynamic>> hrAction(Map<String, dynamic> action) =>
      ApiService.request('/api/hr', method: 'POST', body: action);
  static Future<Map<String, dynamic>> payrollAction(
    Map<String, dynamic> action,
  ) => ApiService.request('/api/payroll', method: 'POST', body: action);
  static Future<Map<String, dynamic>> accountingAction(
    Map<String, dynamic> action,
  ) => ApiService.request('/api/accounting', method: 'POST', body: action);
}
