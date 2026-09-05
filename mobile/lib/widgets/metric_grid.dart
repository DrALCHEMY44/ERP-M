import 'package:flutter/material.dart';

class WorkspaceMetric {
  const WorkspaceMetric({
    required this.label,
    required this.value,
    this.detail,
  });

  final String label;
  final String value;
  final String? detail;
}

/// Intrinsic-height cards keep amounts readable, including with larger text.
class MetricGrid extends StatelessWidget {
  const MetricGrid({super.key, required this.metrics});

  final List<WorkspaceMetric> metrics;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return LayoutBuilder(
      builder: (context, constraints) {
        final largeText = MediaQuery.textScalerOf(context).scale(14) > 20;
        final columns = constraints.maxWidth < 340 || largeText
            ? 1
            : constraints.maxWidth < 760
            ? 2
            : 3;
        final width = (constraints.maxWidth - (columns - 1) * 12) / columns;
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: metrics
              .map(
                (metric) => SizedBox(
                  width: width,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            metric.label,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            metric.value,
                            style: theme.textTheme.headlineSmall,
                          ),
                          if (metric.detail != null) ...[
                            const SizedBox(height: 8),
                            Text(
                              metric.detail!,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        );
      },
    );
  }
}
