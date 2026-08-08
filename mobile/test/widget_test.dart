// This is a Flutter widget test for SmartERPApp's login screen.

import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:erp_mobile/main.dart';
import 'package:erp_mobile/providers/core_provider.dart';
import 'package:erp_mobile/providers/inventory_provider.dart';
import 'package:erp_mobile/providers/transaction_provider.dart';
import 'package:erp_mobile/providers/task_provider.dart';
import 'package:erp_mobile/providers/theme_provider.dart';

void main() {
  testWidgets('SmartERP Login Screen smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => CoreProvider()),
        ChangeNotifierProvider(create: (_) => InventoryProvider()),
        ChangeNotifierProvider(create: (_) => TransactionProvider()),
        ChangeNotifierProvider(create: (_) => TaskProvider()),
        ],
        child: const SmartERPApp(),
      ),
    );

    // Verify that the login screen title and subtitle are present.
    expect(find.text('martERP AI'), findsOneWidget);
    expect(find.text('AI-Powered SME Operations Platform'), findsOneWidget);

    // Verify that the "Password" field and "Sign In to Account" button are present.
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Sign In to Account'), findsOneWidget);
  });
}
