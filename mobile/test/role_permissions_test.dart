import 'package:erp_mobile/models/app_user.dart';
import 'package:erp_mobile/services/auth_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('every operational role has an explicit permission profile', () {
    for (final role in UserRole.values) {
      expect(
        AuthService.rolePermissions.containsKey(role),
        isTrue,
        reason: '${role.displayName} must have an explicit permission profile',
      );
    }
  });

  test('staff cannot manage privileged financial or employee modules', () {
    final staff = AuthService.rolePermissions[UserRole.staff]!;
    expect(staff, containsAll(['viewInventory', 'viewTasks', 'useAi']));
    expect(
      staff,
      isNot(
        contains(anyOf('manageAccounting', 'managePayroll', 'manageEmployees')),
      ),
    );
  });

  test('accountants and HR officers receive separated duties', () {
    final accountant = AuthService.rolePermissions[UserRole.accountant]!;
    final hr = AuthService.rolePermissions[UserRole.hrOfficer]!;

    expect(
      accountant,
      containsAll(['viewAccounting', 'manageAccounting', 'viewPayroll']),
    );
    expect(accountant, isNot(contains('manageEmployees')));
    expect(hr, containsAll(['manageEmployees', 'manageHr', 'managePayroll']));
    expect(hr, isNot(contains('manageAccounting')));
  });

  test(
    'only the platform administrator and owner profiles are unrestricted',
    () {
      expect(
        AuthService.rolePermissions[UserRole.platformSuperAdmin],
        contains('managePlatform'),
      );
      expect(
        AuthService.rolePermissions[UserRole.businessOwner],
        equals(['*']),
      );
      for (final role in UserRole.values.where(
        (role) =>
            role != UserRole.platformSuperAdmin &&
            role != UserRole.businessOwner,
      )) {
        expect(AuthService.rolePermissions[role], isNot(contains('*')));
      }
    },
  );
}
