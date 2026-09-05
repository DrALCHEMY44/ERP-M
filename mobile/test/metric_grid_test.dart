import 'package:erp_mobile/theme/app_theme.dart';
import 'package:erp_mobile/widgets/metric_grid.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  for (final width in [320.0, 390.0, 768.0, 1366.0]) {
    for (final scale in [1.0, 2.0]) {
      for (final dark in [false, true]) {
        testWidgets('metrics fit width=$width scale=$scale dark=$dark', (
          tester,
        ) async {
          tester.view.physicalSize = Size(width, 1000);
          tester.view.devicePixelRatio = 1;
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          await tester.pumpWidget(
            MaterialApp(
              theme: dark ? AppTheme.dark : AppTheme.light,
              builder: (context, child) => MediaQuery(
                data: MediaQuery.of(
                  context,
                ).copyWith(textScaler: TextScaler.linear(scale)),
                child: child!,
              ),
              home: const Scaffold(
                body: SingleChildScrollView(
                  padding: EdgeInsets.all(20),
                  child: MetricGrid(
                    metrics: [
                      WorkspaceMetric(
                        label: 'Monthly recurring revenue',
                        value: '1,250,000 FCFA',
                        detail: 'All active subscriptions',
                      ),
                      WorkspaceMetric(
                        label: 'Outstanding balance',
                        value: '850,000 FCFA',
                      ),
                      WorkspaceMetric(
                        label: 'Registered users',
                        value: '1,240',
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
          expect(find.byType(Card), findsNWidgets(3));
          expect(find.text('1,250,000 FCFA'), findsOneWidget);
          for (final element in find.byType(Card).evaluate()) {
            final box = element.renderObject! as RenderBox;
            final left = box.localToGlobal(Offset.zero).dx;
            expect(left, greaterThanOrEqualTo(0));
            expect(left + box.size.width, lessThanOrEqualTo(width));
          }
        });
      }
    }
  }
}
