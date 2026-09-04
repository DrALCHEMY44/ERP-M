import 'package:erp_mobile/providers/core_provider.dart';
import 'package:erp_mobile/providers/inventory_provider.dart';
import 'package:erp_mobile/providers/task_provider.dart';
import 'package:erp_mobile/providers/transaction_provider.dart';
import 'package:erp_mobile/screens/login_screen.dart';
import 'package:erp_mobile/screens/registration_screen.dart';
import 'package:erp_mobile/screens/welcome_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

void main() {
  Future<void> pumpLogin(WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => CoreProvider()),
          ChangeNotifierProvider(create: (_) => InventoryProvider()),
          ChangeNotifierProvider(create: (_) => TransactionProvider()),
          ChangeNotifierProvider(create: (_) => TaskProvider()),
        ],
        child: const MaterialApp(home: LoginScreen()),
      ),
    );
  }

  testWidgets('authenticated login form renders without demo credentials', (
    WidgetTester tester,
  ) async {
    await pumpLogin(tester);

    expect(find.text('Welcome to SmartERP'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
    expect(find.textContaining('Quick-Login'), findsNothing);
  });

  testWidgets('email login rejects missing and malformed credentials', (
    WidgetTester tester,
  ) async {
    await pumpLogin(tester);

    await tester.tap(find.widgetWithText(FilledButton, 'Sign In'));
    await tester.pump();
    expect(find.text('Invalid registered email address'), findsOneWidget);
    expect(find.text('Please enter your password'), findsOneWidget);

    final fields = find.byType(TextFormField);
    await tester.enterText(fields.at(0), 'not-an-email');
    await tester.enterText(fields.at(1), 'password');
    await tester.tap(find.widgetWithText(FilledButton, 'Sign In'));
    await tester.pump();
    expect(find.text('Invalid registered email address'), findsOneWidget);
  });

  testWidgets('employee roles require business name and access code', (
    WidgetTester tester,
  ) async {
    await pumpLogin(tester);

    await tester.tap(find.byType(DropdownButtonFormField<bool>));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Team access code').last);
    await tester.pumpAndSettle();

    expect(find.text('Team role'), findsOneWidget);
    expect(find.text('Registered Business Name'), findsOneWidget);
    expect(find.text('Access Code'), findsOneWidget);
    expect(find.text('Email Address'), findsNothing);
    expect(find.text('Password'), findsNothing);

    await tester.tap(find.widgetWithText(FilledButton, 'Sign In'));
    await tester.pump();
    expect(find.text('Please enter your registered name'), findsOneWidget);
    expect(find.text('Business name is required'), findsOneWidget);
    expect(find.text('Your unique access code is required'), findsOneWidget);
  });

  testWidgets('welcome flow reaches login and tenant registration', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => CoreProvider()),
          ChangeNotifierProvider(create: (_) => InventoryProvider()),
          ChangeNotifierProvider(create: (_) => TransactionProvider()),
          ChangeNotifierProvider(create: (_) => TaskProvider()),
        ],
        child: MaterialApp(
          initialRoute: '/welcome',
          routes: {
            '/welcome': (_) => const WelcomeScreen(),
            '/login': (_) => const LoginScreen(),
            '/register': (_) => const RegistrationScreen(),
          },
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Your business, always in focus.'), findsOneWidget);
    await tester.tap(find.text('Skip'));
    await tester.pumpAndSettle();
    expect(find.text('Welcome to SmartERP'), findsOneWidget);

    await tester.tap(find.text("Don't have an account? Register"));
    await tester.pumpAndSettle();
    expect(find.text('Register Business Tenant'), findsOneWidget);
    expect(find.text('Create Isolated Tenant Workspace'), findsOneWidget);
  });
}
