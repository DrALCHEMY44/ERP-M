enum UserRole {
  platformSuperAdmin,
  businessOwner,
  manager,
  accountant,
  hrOfficer,
  staff,
  viewer;

  String get displayName {
    switch (this) {
      case UserRole.platformSuperAdmin:
        return 'Platform Super Admin';
      case UserRole.businessOwner:
        return 'Business Owner';
      case UserRole.manager:
        return 'Manager';
      case UserRole.accountant:
        return 'Accountant';
      case UserRole.hrOfficer:
        return 'HR Officer';
      case UserRole.staff:
        return 'Staff';
      case UserRole.viewer:
        return 'Viewer';
    }
  }

  static UserRole fromString(String roleStr) {
    switch (roleStr) {
      case 'Platform Super Admin':
        return UserRole.platformSuperAdmin;
      case 'Business Owner':
        return UserRole.businessOwner;
      case 'Manager':
        return UserRole.manager;
      case 'Accountant':
        return UserRole.accountant;
      case 'HR Officer':
        return UserRole.hrOfficer;
      case 'Staff':
        return UserRole.staff;
      case 'Viewer':
      default:
        return UserRole.viewer;
    }
  }
}

class AppUser {
  final String id;
  final String name;
  final String email;
  final String tenantId;
  final String businessId;
  final UserRole role;
  final String? businessCode;
  final String? accessCode;

  AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.tenantId,
    required this.businessId,
    required this.role,
    this.businessCode,
    this.accessCode,
  });
}
