import 'dart:convert';

import 'package:http/http.dart' as http;
import '../models/app_user.dart';
import 'api_service.dart';
import 'api_config.dart';
import 'session_store.dart';

class AuthService {
  static AppUser? _currentUser;
  static String get _apiBaseUrl => ApiConfig.baseUrl;

  // Web app permissions mapping
  static const Map<UserRole, List<String>> rolePermissions = {
    UserRole.platformSuperAdmin: ['managePlatform'],
    UserRole.businessOwner: ['*'], // Full access
    UserRole.manager: [
      'viewInventory',
      'manageInventory',
      'viewSales',
      'manageSales',
      'viewExpenses',
      'manageExpenses',
      'viewTasks',
      'manageTasks',
      'viewReports',
      'viewActivityLogs',
      'viewEmployees',
      'viewCustomers',
      'manageCustomers',
      'viewSuppliers',
      'manageSuppliers',
      'viewDocuments',
      'manageDocuments',
      'viewHr',
      'viewAccounting',
      'publishAnnouncements',
      'useAi',
    ],
    UserRole.accountant: [
      'viewSales',
      'manageSales',
      'viewExpenses',
      'manageExpenses',
      'viewFinance',
      'manageFinance',
      'viewAccounting',
      'manageAccounting',
      'viewPayroll',
      'viewReports',
      'viewDocuments',
      'useAi',
    ],
    UserRole.hrOfficer: [
      'viewEmployees',
      'manageEmployees',
      'viewAttendance',
      'viewSalaryRecords',
      'viewHr',
      'manageHr',
      'viewPayroll',
      'managePayroll',
      'viewReports',
      'viewTasks',
      'manageTasks',
      'viewDocuments',
      'manageDocuments',
      'useAi',
    ],
    UserRole.staff: [
      'viewInventory',
      'viewSales',
      'viewTasks',
      'completeAssignedTasks',
      'viewDocuments',
      'useAi',
    ],
    UserRole.viewer: [
      'viewInventory',
      'viewSales',
      'viewTasks',
      'viewReports',
      'viewDocuments',
      'useAi',
    ],
  };

  static const Map<String, String> _canonicalPermissions = {
    'managePlatform': 'platform:manage',
    'viewInventory': 'inventory:read',
    'manageInventory': 'inventory:write',
    'viewSales': 'sales:read',
    'manageSales': 'sales:write',
    'viewExpenses': 'expenses:read',
    'manageExpenses': 'expenses:write',
    'viewFinance': 'expenses:read',
    'manageFinance': 'accounting:write',
    'viewTasks': 'tasks:read',
    'manageTasks': 'tasks:write',
    'completeAssignedTasks': 'tasks:read',
    'viewReports': 'reports:read',
    'viewActivityLogs': 'audit:read',
    'viewEmployees': 'employees:read',
    'manageEmployees': 'employees:write',
    'viewCustomers': 'customers:read',
    'manageCustomers': 'customers:write',
    'viewSuppliers': 'suppliers:read',
    'manageSuppliers': 'suppliers:write',
    'viewDocuments': 'documents:read',
    'manageDocuments': 'documents:write',
    'viewHr': 'hr:read',
    'manageHr': 'hr:write',
    'viewPayroll': 'payroll:read',
    'managePayroll': 'payroll:write',
    'approvePayroll': 'payroll:approve',
    'viewAccounting': 'accounting:read',
    'manageAccounting': 'accounting:write',
    'closeAccounting': 'accounting:close',
    'publishAnnouncements': 'tasks:write',
    'useAi': 'ai:use',
  };

  static Map<String, dynamic> _decode(http.Response response) {
    try {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } on FormatException {
      throw Exception(
        'The authentication server returned an invalid response.',
      );
    }
  }

  static Future<void> _storeAuthToken(http.Response response) async {
    final data = _decode(response);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final error =
          data['message'] ?? data['error'] ?? 'Authentication failed.';
      throw Exception(error is Map ? error['message'] : error);
    }
    final token =
        response.headers['set-auth-token'] ?? data['token'] as String?;
    if (token == null || token.isEmpty) {
      throw Exception(
        'The authentication server did not issue a session token.',
      );
    }
    await SessionStore.writeToken(token);
  }

  static Future<void> registerOwner({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http
        .post(
          Uri.parse('$_apiBaseUrl/api/auth/sign-up/email'),
          headers: const {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonEncode({
            'name': name.trim(),
            'email': email.trim().toLowerCase(),
            'password': password,
          }),
        )
        .timeout(const Duration(seconds: 20));
    if (response.statusCode >= 200 && response.statusCode < 300) {
      await _storeAuthToken(response);
      return;
    }

    final data = _decode(response);
    final error = data['message'] ?? data['error'] ?? 'Registration failed.';
    final message = error is Map
        ? error['message'].toString()
        : error.toString();
    final accountAlreadyExists =
        response.statusCode == 409 ||
        response.statusCode == 422 ||
        message.toLowerCase().contains('already');
    if (!accountAlreadyExists) throw Exception(message);

    // A previous attempt may have created the Neon identity before workspace
    // bootstrap failed. Sign in with the supplied credentials so registration
    // can safely resume instead of leaving the owner permanently stuck.
    final signInResponse = await http
        .post(
          Uri.parse('$_apiBaseUrl/api/auth/sign-in/email'),
          headers: const {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'password': password,
            'rememberMe': true,
          }),
        )
        .timeout(const Duration(seconds: 20));
    await _storeAuthToken(signInResponse);
  }

  static Future<void> requestPasswordReset(String email) async {
    final response = await http
        .post(
          Uri.parse('$_apiBaseUrl/api/auth/request-password-reset'),
          headers: const {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'redirectTo': '$_apiBaseUrl/reset-password',
          }),
        )
        .timeout(const Duration(seconds: 20));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final data = _decode(response);
      throw Exception(
        data['message'] ?? data['error'] ?? 'Password reset failed.',
      );
    }
  }

  /// Authenticates linked accounts with Neon Auth and provisioned employees
  /// with a company access code. The server profile determines the real role.
  static Future<AppUser?> login({
    required bool useEmployeeAccess,
    required String roleProfile,
    required String fullName,
    required String email,
    required String password,
    String businessName = '',
    String accessCode = '',
  }) async {
    final normalizedName = fullName.trim();
    if (useEmployeeAccess) {
      if (businessName.trim().isEmpty || accessCode.trim().isEmpty) {
        throw Exception('Business name and access code are required.');
      }

      final response = await http.post(
        Uri.parse('$_apiBaseUrl/api/auth/employee-token'),
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode({
          'fullName': normalizedName,
          'businessName': businessName.trim(),
          'accessCode': accessCode.trim().toUpperCase(),
          'roleProfile': roleProfile,
        }),
      );
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw Exception(data['error'] ?? 'Employee login failed.');
      }
      await SessionStore.writeToken(data['token'] as String);
      _currentUser = await refreshCurrentUser();
      return _currentUser;
    }

    final signInResponse = await http
        .post(
          Uri.parse('$_apiBaseUrl/api/auth/sign-in/email'),
          headers: const {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonEncode({
            'email': email.trim().toLowerCase(),
            'password': password,
            'rememberMe': true,
          }),
        )
        .timeout(const Duration(seconds: 20));
    await _storeAuthToken(signInResponse);
    await refreshCurrentUser();
    return _currentUser;
  }

  static AppUser? get currentUser => _currentUser;

  static AppUser _fromAccount(Map<String, dynamic> account) {
    return AppUser(
      id: (account['id'] ?? account['uid']).toString(),
      name: account['fullName'] as String? ?? '',
      email: account['email'] as String? ?? '',
      tenantId: account['tenantId'] as String? ?? '',
      businessId: account['businessId'] as String? ?? '',
      role: UserRole.fromString(account['role'] as String? ?? 'Viewer'),
      businessCode: account['businessCode'] as String?,
      permissions: (account['permissions'] as List<dynamic>? ?? const [])
          .map((value) => value.toString())
          .toList(growable: false),
    );
  }

  static Future<AppUser?> restoreSession() async {
    final token = await SessionStore.readToken();
    if (token == null || token.isEmpty) return null;
    try {
      return await refreshCurrentUser();
    } on ApiException catch (error) {
      if (error.isAuthenticationFailure) await SessionStore.clear();
      if (error.isAuthenticationFailure) return null;
      rethrow;
    }
  }

  static Future<AppUser> refreshCurrentUser() async {
    final profileResponse = await ApiService.request(
      '/api/profile',
      retryTransient: true,
    );
    final account = profileResponse['user'] as Map<String, dynamic>;
    _currentUser = _fromAccount(account);
    return _currentUser!;
  }

  static bool hasPermission(String permission) {
    if (_currentUser == null) return false;
    if (_currentUser!.permissions.isNotEmpty) {
      final canonical = _canonicalPermissions[permission] ?? permission;
      return _currentUser!.permissions.contains(canonical);
    }
    final permissions = rolePermissions[_currentUser!.role];
    if (permissions == null) return false;
    if (permissions.contains('*')) return true;
    return permissions.contains(permission);
  }

  static Future<void> logout() async {
    final token = await SessionStore.readToken();
    if (token != null) {
      final path = token.startsWith('erp_session_')
          ? '/api/auth/logout'
          : '/api/auth/sign-out';
      try {
        await http
            .post(
              Uri.parse('$_apiBaseUrl$path'),
              headers: {'Authorization': 'Bearer $token'},
            )
            .timeout(const Duration(seconds: 10));
      } catch (_) {
        // Local deletion still signs the device out if the network is down.
      }
    }
    await SessionStore.clear();
    _currentUser = null;
  }
}
