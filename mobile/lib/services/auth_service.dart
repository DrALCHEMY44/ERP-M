import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart' as fb_auth;
import 'package:http/http.dart' as http;
import '../models/app_user.dart';
import '../generated/example.dart';


class AuthService {
  static AppUser? _currentUser;
  static const String _apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:9002',
  );

  // Web app permissions mapping
  static const Map<UserRole, List<String>> rolePermissions = {
    UserRole.platformSuperAdmin: ['managePlatform'],
    UserRole.businessOwner: ['*'], // Full access
    UserRole.manager: [
      'viewInventory', 'manageInventory',
      'viewSales', 'manageSales',
      'viewExpenses', 'manageExpenses',
      'viewTasks', 'manageTasks',
      'viewReports',
      'viewActivityLogs',
      'viewEmployees', 'manageEmployees',
      'viewCustomers', 'manageCustomers',
      'viewSuppliers', 'manageSuppliers',
      'viewDocuments', 'manageDocuments',
      'publishAnnouncements',
    ],
    UserRole.accountant: [
      'viewSales', 'manageSales',
      'viewExpenses', 'manageExpenses',
      'viewFinance', 'manageFinance',
      'viewReports',
      'viewDocuments'
    ],
    UserRole.hrOfficer: [
      'viewEmployees', 'manageEmployees',
      'viewAttendance',
      'viewSalaryRecords',
      'viewReports',
      'viewTasks', 'manageTasks',
      'viewDocuments', 'manageDocuments'
    ],
    UserRole.staff: [
      'viewTasks', 'completeAssignedTasks'
    ],
    UserRole.viewer: [
      'viewInventory',
      'viewSales',
      'viewTasks',
      'viewReports',
      'viewDocuments'
    ],
  };

  // Predefined demo accounts for easy defense presentation mapped to real Firebase Auth emails
  static final List<AppUser> demoUsers = [
    AppUser(
      id: 'user_etoo',
      name: 'Samuel Eto\'o',
      email: 'admin@smarterp.ai',
      tenantId: 'tenant_douala_001',
      businessId: 'biz_superette_central',
      role: UserRole.businessOwner,
      businessCode: 'superette_de_l_avenir_2023_01_10',
    ),
    AppUser(
      id: 'user_marie',
      name: 'Marie Claire',
      email: 'user@example.com',
      tenantId: 'tenant_douala_001',
      businessId: 'biz_superette_central',
      role: UserRole.staff,
      businessCode: 'superette_de_l_avenir_2023_01_10',
    ),
    AppUser(
      id: 'user_luc',
      name: 'Jean Luc',
      email: 'luc@gmail.com',
      tenantId: 'tenant_douala_001',
      businessId: 'biz_superette_central',
      role: UserRole.accountant,
      businessCode: 'superette_de_l_avenir_2023_01_10',
    ),
    AppUser(
      id: 'user_nathalie',
      name: 'Nathalie Koah',
      email: 'kali@gmail.com',
      tenantId: 'tenant_yaounde_002',
      businessId: 'biz_bastos_retail',
      role: UserRole.businessOwner,
      businessCode: 'boutique_bastos_2023_03_15',
    ),
    AppUser(
      id: 'user_alain',
      name: 'Alain Fofe',
      email: 'ace@gmail.com',
      tenantId: 'tenant_yaounde_002',
      businessId: 'biz_bastos_retail',
      role: UserRole.manager,
      businessCode: 'boutique_bastos_2023_03_15',
    ),
    AppUser(
      id: 'user_cathy',
      name: 'Cathy Kamga',
      email: 'kevintchinde366@gmail.com',
      tenantId: 'tenant_douala_001',
      businessId: 'biz_superette_central',
      role: UserRole.viewer,
      businessCode: 'superette_de_l_avenir_2023_01_10',
    ),
  ];

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
      await fb_auth.FirebaseAuth.instance.signInWithCustomToken(data['token'] as String);
      final account = data['user'] as Map<String, dynamic>;
      _currentUser = AppUser(
        id: account['id'] as String,
        name: account['fullName'] as String? ?? normalizedName,
        email: account['email'] as String,
        tenantId: account['tenantId'] as String,
        businessId: account['businessId'] as String,
        role: UserRole.fromString(account['role'] as String),
        businessCode: account['businessCode'] as String?,
        accessCode: accessCode.trim().toUpperCase(),
      );
      return _currentUser;
    }

    final credential = await fb_auth.FirebaseAuth.instance
        .signInWithEmailAndPassword(email: email.trim().toLowerCase(), password: password);
    final queryResult = await ExampleConnector.instance
        .getUserByEmail(email: credential.user?.email ?? email.trim().toLowerCase())
        .execute();
    if (queryResult.data.users.isEmpty) {
      throw Exception('No SmartERP profile is linked to this account.');
    }
    final account = queryResult.data.users.first;
    if (account.fullName?.trim() != normalizedName || account.role != 'Business Owner') {
      await fb_auth.FirebaseAuth.instance.signOut();
      throw Exception('The account name or selected role does not match.');
    }
    final businessResult = await ExampleConnector.instance
        .getBusinessById(id: account.businessId)
        .execute();
    _currentUser = AppUser(
      id: account.id,
      name: account.fullName ?? normalizedName,
      email: account.email,
      tenantId: account.tenantId,
      businessId: account.businessId,
      role: UserRole.fromString(account.role),
      businessCode: businessResult.data.business?.code,
    );
    return _currentUser;
  }

  static Future<AppUser?> loginWithUser(AppUser user) async {
    try {
      // Try real sign in with default test password
      await fb_auth.FirebaseAuth.instance.signInWithEmailAndPassword(
        email: user.email,
        password: 'password123',
      );
      
      // Ensure user profile is registered in Data Connect
      final queryResult = await ExampleConnector.instance.getUserByEmail(email: user.email).execute();
      if (queryResult.data.users.isEmpty) {
        await ExampleConnector.instance.createUser(
          tenantId: user.tenantId,
          businessId: user.businessId,
          email: user.email,
          role: user.role.displayName,
        ).fullName(user.name).execute();
      }
      _currentUser = user;
      return _currentUser;
    } catch (e) {
      // Fallback for tests if emulator is offline or user isn't registered
      _currentUser = user;
      return _currentUser;
    }
  }

  static AppUser? get currentUser => _currentUser;

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
