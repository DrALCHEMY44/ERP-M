import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart' as fb_auth;
import 'package:http/http.dart' as http;
import '../models/app_user.dart';
import 'api_service.dart';
import 'api_config.dart';

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
      'manageEmployees',
      'viewCustomers',
      'manageCustomers',
      'viewSuppliers',
      'manageSuppliers',
      'viewDocuments',
      'manageDocuments',
      'publishAnnouncements',
    ],
    UserRole.accountant: [
      'viewSales',
      'manageSales',
      'viewExpenses',
      'manageExpenses',
      'viewFinance',
      'manageFinance',
      'viewReports',
      'viewDocuments',
    ],
    UserRole.hrOfficer: [
      'viewEmployees',
      'manageEmployees',
      'viewAttendance',
      'viewSalaryRecords',
      'viewReports',
      'viewTasks',
      'manageTasks',
      'viewDocuments',
      'manageDocuments',
    ],
    UserRole.staff: ['viewTasks', 'completeAssignedTasks'],
    UserRole.viewer: [
      'viewInventory',
      'viewSales',
      'viewTasks',
      'viewReports',
      'viewDocuments',
    ],
  };


  /// Authenticates an employee against the Next.js backend REST API.
  /// Validates: [fullName], [email], [password], and [roleProfile].
  ///
  /// This cross-references the employee profile in the PostgreSQL database.
  /// If all credentials match, a secure JWT session is returned and parsed.
  static Future<AppUser?> login({
    required String roleProfile,
    required String fullName,
    required String email,
    required String password,
    String businessName = '',
    String accessCode = '',
  }) async {
    final normalizedName = fullName.trim();

    if (roleProfile == 'Manager' || roleProfile == 'Employee') {
      if (businessName.trim().isEmpty || accessCode.trim().isEmpty) {
        throw Exception('Business name and employee code are required.');
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
      await fb_auth.FirebaseAuth.instance.signInWithCustomToken(
        data['token'] as String,
      );
      final account = data['user'] as Map<String, dynamic>;
      _currentUser = AppUser(
        id: account['id'] as String,
        name: account['fullName'] as String? ?? normalizedName,
        email: account['email'] as String,
        tenantId: account['tenantId'] as String,
        businessId: account['businessId'] as String,
        role: UserRole.fromString(account['role'] as String),
        businessCode: account['businessCode'] as String?,
      );
      return _currentUser;
    }

    await fb_auth.FirebaseAuth.instance.signInWithEmailAndPassword(
      email: email.trim().toLowerCase(),
      password: password,
    );
    final profileResponse = await ApiService.request('/api/profile');
    final account = profileResponse['user'] as Map<String, dynamic>;
    if ((account['fullName'] as String?)?.trim() != normalizedName ||
        account['role'] != 'Business Owner') {
      await fb_auth.FirebaseAuth.instance.signOut();
      throw Exception('The account name or selected role does not match.');
    }
    _currentUser = AppUser(
      id: account['uid'] as String,
      name: account['fullName'] as String? ?? normalizedName,
      email: account['email'] as String,
      tenantId: account['tenantId'] as String,
      businessId: account['businessId'] as String,
      role: UserRole.fromString(account['role'] as String),
    );
    return _currentUser;
  }

  static AppUser? get currentUser => _currentUser;

  static Future<AppUser> refreshCurrentUser() async {
    final profileResponse = await ApiService.request('/api/profile');
    final account = profileResponse['user'] as Map<String, dynamic>;
    _currentUser = AppUser(
      id: (account['id'] ?? account['uid']) as String,
      name: account['fullName'] as String? ?? '',
      email: account['email'] as String,
      tenantId: account['tenantId'] as String,
      businessId: account['businessId'] as String,
      role: UserRole.fromString(account['role'] as String),
      businessCode: account['businessCode'] as String?,
    );
    return _currentUser!;
  }

  static bool hasPermission(String permission) {
    if (_currentUser == null) return false;
    final permissions = rolePermissions[_currentUser!.role];
    if (permissions == null) return false;
    if (permissions.contains('*')) return true;
    return permissions.contains(permission);
  }

  static Future<void> logout() async {
    await fb_auth.FirebaseAuth.instance.signOut();
    _currentUser = null;
  }
}
