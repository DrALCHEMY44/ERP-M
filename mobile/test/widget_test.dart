import 'package:erp_mobile/providers/core_provider.dart';
import 'package:erp_mobile/providers/inventory_provider.dart';
import 'package:erp_mobile/providers/task_provider.dart';
import 'package:erp_mobile/providers/transaction_provider.dart';
import 'package:erp_mobile/screens/login_screen.dart';
import 'package:erp_mobile/screens/registration_screen.dart';
import 'package:erp_mobile/screens/welcome_screen.dart';
import 'package:erp_mobile/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

void main() {
  Future<void> pumpScreen(
    WidgetTester tester,
    Widget screen, {
    Size viewport = const Size(1080, 1920),
    Brightness brightness = Brightness.light,
    double textScale = 1,
  }) async {
    tester.view.physicalSize = viewport;
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
          theme: brightness == Brightness.dark ? AppTheme.dark : AppTheme.light,
          builder: (context, child) => MediaQuery(
            data: MediaQuery.of(
              context,
            ).copyWith(textScaler: TextScaler.linear(textScale)),
            child: child!,
          ),
          home: screen,
          routes: {
            '/login': (_) => const LoginScreen(),
            '/register': (_) => const RegistrationScreen(),
          },
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('login exposes both secure sign-in methods', (tester) async {
    await pumpScreen(tester, const LoginScreen());
    expect(find.text('Welcome back'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Team code'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.textContaining('Quick-Login'), findsNothing);
  });

  testWidgets('email login rejects missing and malformed credentials', (
    tester,
  ) async {
    await pumpScreen(tester, const LoginScreen());
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pump();
    expect(find.text('Invalid registered email address'), findsOneWidget);
    expect(find.text('Please enter your password'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField).at(0), 'not-an-email');
    await tester.enterText(find.byType(TextFormField).at(1), 'password');
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pump();
    expect(find.text('Invalid registered email address'), findsOneWidget);
  });

  testWidgets(
    'manager and staff login retains required business and access code',
    (tester) async {
      await pumpScreen(tester, const LoginScreen());
      await tester.tap(find.text('Team code'));
      await tester.pumpAndSettle();
      expect(find.text('Team role'), findsOneWidget);
      expect(find.text('Business name'), findsOneWidget);
      expect(find.text('Access code'), findsOneWidget);
      expect(find.text('Email address'), findsNothing);
      expect(find.text('Password'), findsNothing);

      await tester.tap(find.byType(DropdownButtonFormField<String>));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Manager').last);
      await tester.pumpAndSettle();
      expect(find.text('Manager'), findsOneWidget);
      await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
      await tester.pump();
      expect(find.text('Please enter your registered name'), findsOneWidget);
      expect(find.text('Business name is required'), findsOneWidget);
      expect(find.text('Your unique access code is required'), findsOneWidget);
    },
  );

  testWidgets('welcome flow reaches login and tenant registration', (
    tester,
  ) async {
    await pumpScreen(tester, const WelcomeScreen());
    await tester.tap(find.text('Sign in to your workspace'));
    await tester.pumpAndSettle();
    expect(find.text('Welcome back'), findsOneWidget);

    await tester.tap(find.text('New business? Create an account'));
    await tester.pumpAndSettle();
    expect(find.text('Create your business'), findsOneWidget);
    expect(find.text('Your account'), findsOneWidget);
    expect(find.text('Your business'), findsOneWidget);
    expect(find.text('Create business'), findsOneWidget);
  });

  testWidgets('invitation flow only asks for account and invitation fields', (
    tester,
  ) async {
    await pumpScreen(tester, const RegistrationScreen());
    await tester.tap(find.byType(SwitchListTile));
    await tester.pumpAndSettle();
    expect(find.text('Join your workspace'), findsOneWidget);
    expect(find.text('Business name'), findsNothing);
    expect(find.text('Industry'), findsNothing);
    expect(find.text('Invitation token'), findsOneWidget);
    await tester.tap(find.widgetWithText(FilledButton, 'Join workspace'));
    await tester.pump();
    expect(find.text('Enter your invitation token'), findsOneWidget);
  });

  testWidgets(
    'registration password visibility works without discarding input',
    (tester) async {
      await pumpScreen(tester, const RegistrationScreen());
      final password = find.byType(TextFormField).at(2);
      await tester.enterText(password, 'SamplePassword8');
      expect(
        tester.widget<TextFormField>(password).controller!.text,
        'SamplePassword8',
      );
      expect(
        tester
            .widget<TextField>(
              find.descendant(of: password, matching: find.byType(TextField)),
            )
            .obscureText,
        isTrue,
      );
      await tester.tap(find.byTooltip('Show password'));
      await tester.pump();
      expect(
        tester
            .widget<TextField>(
              find.descendant(of: password, matching: find.byType(TextField)),
            )
            .obscureText,
        isFalse,
      );
      expect(
        tester.widget<TextFormField>(password).controller!.text,
        'SamplePassword8',
      );
    },
  );

  for (final brightness in Brightness.values) {
    for (final viewport in [
      const Size(320, 568),
      const Size(390, 844),
      const Size(1366, 768),
    ]) {
      testWidgets('auth screens fit $viewport in $brightness', (tester) async {
        for (final screen in <Widget>[
          const WelcomeScreen(),
          const LoginScreen(),
          const RegistrationScreen(),
        ]) {
          await pumpScreen(
            tester,
            screen,
            viewport: viewport,
            brightness: brightness,
          );
          final layoutException = tester.takeException();
          expect(
            layoutException,
            isNull,
            reason: '${screen.runtimeType} overflowed at $viewport',
          );
          if (screen is RegistrationScreen) {
            final business = find.byKey(
              const ValueKey('registration-business'),
            );
            expect(tester.getSize(business).width, lessThanOrEqualTo(592));
            await tester.ensureVisible(
              find.widgetWithText(FilledButton, 'Create business'),
            );
            await tester.pumpAndSettle();
            expect(tester.takeException(), isNull);
            // A long sector name must stay within a narrow phone's form.
            await tester.ensureVisible(
              find.byType(DropdownButtonFormField<String>),
            );
            await tester.tap(find.byType(DropdownButtonFormField<String>));
            await tester.pumpAndSettle();
            await tester.tap(find.text('Healthcare & Pharmaceuticals').last);
            await tester.pumpAndSettle();
            expect(tester.takeException(), isNull);
          }
        }
      });
    }
  }

  testWidgets(
    'small-screen registration supports larger text and keyboard inset',
    (tester) async {
      await pumpScreen(
        tester,
        const RegistrationScreen(),
        viewport: const Size(320, 568),
        textScale: 1.5,
      );
      tester.view.viewInsets = const FakeViewPadding(bottom: 240);
      addTearDown(tester.view.resetViewInsets);
      await tester.pumpAndSettle();
      await tester.ensureVisible(
        find.widgetWithText(FilledButton, 'Create business'),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await tester.tap(find.widgetWithText(FilledButton, 'Create business'));
      await tester.pump();
      expect(find.text('Enter your full name'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
