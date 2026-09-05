import 'package:flutter/material.dart';
import '../widgets/auth_layout.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final inset = constraints.maxWidth < 400 ? 20.0 : 32.0;
            return SingleChildScrollView(
              padding: EdgeInsets.all(inset),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1040),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          const Expanded(
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: SmartERPBrand(),
                              ),
                            ),
                          ),
                          if (constraints.maxWidth >= 400)
                            TextButton(
                              onPressed: () =>
                                  Navigator.pushNamed(context, '/login'),
                              child: const Text('Sign in'),
                            ),
                        ],
                      ),
                      const SizedBox(height: 36),
                      LayoutBuilder(
                        builder: (context, bodyConstraints) {
                          final introduction = _introduction(context);
                          final features = _features(context);
                          if (bodyConstraints.maxWidth < 780) {
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                introduction,
                                const SizedBox(height: 24),
                                features,
                              ],
                            );
                          }
                          return Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Expanded(flex: 6, child: introduction),
                              const SizedBox(width: 40),
                              Expanded(flex: 5, child: features),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 32),
                      Text(
                        'One workspace for business owners, managers and staff.',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _introduction(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: EdgeInsets.all(MediaQuery.sizeOf(context).width < 400 ? 24 : 32),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: const Color(0xFF1E3A5F),
              borderRadius: BorderRadius.circular(30),
            ),
            child: const Text(
              'YOUR BUSINESS, CONNECTED',
              style: TextStyle(
                color: Color(0xFFBFDBFE),
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 1,
              ),
            ),
          ),
          const SizedBox(height: 26),
          Text(
            'Your business,\nalways in focus.',
            style: theme.textTheme.headlineLarge?.copyWith(
              color: Colors.white,
              fontSize: MediaQuery.sizeOf(context).width < 400 ? 32 : 42,
              height: 1.15,
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Manage your stock, track every sale and keep your team in sync. '
            'Your daily work, all in one place.',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: const Color(0xFFCBD5E1),
            ),
          ),
          const SizedBox(height: 30),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => Navigator.pushNamed(context, '/register'),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
              ),
              child: const AuthSubmitLabel(
                loading: false,
                label: 'Create a business account',
                loadingLabel: '',
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => Navigator.pushNamed(context, '/login'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Color(0xFF526078)),
              ),
              child: const Text('Sign in to your workspace'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _features(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _FeatureCard(
          icon: Icons.inventory_2_outlined,
          title: 'Stay on top of your stock',
          description:
              'Find products, scan barcodes and see what needs restocking.',
          color: Color(0xFF2563EB),
        ),
        SizedBox(height: 16),
        _FeatureCard(
          icon: Icons.receipt_long_outlined,
          title: 'Keep sales moving',
          description:
              'Record sales and expenses, then see how your business is doing.',
          color: Color(0xFF0F766E),
        ),
        SizedBox(height: 16),
        _FeatureCard(
          icon: Icons.groups_outlined,
          title: 'Work better together',
          description:
              'Give managers and staff the access they need to get work done.',
          color: Color(0xFF7C3AED),
        ),
      ],
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
  });

  final IconData icon;
  final String title;
  final String description;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final accent = theme.brightness == Brightness.dark
        ? Color.lerp(color, Colors.white, .45)!
        : color;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: accent.withValues(alpha: .1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: accent, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.titleMedium),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
