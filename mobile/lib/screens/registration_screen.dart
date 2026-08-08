import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb_auth;
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../models/app_user.dart';
import '../generated/example.dart' as dc;

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _businessNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedIndustry = 'Retail';
  bool _isLoadingState = false;

  final List<String> _industries = ['Retail', 'Construction', 'Manufacturing', 'Services', 'Logistics'];

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoadingState = true);
      try {
        final authResult = await fb_auth.FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _emailController.text,
          password: _passwordController.text,
        );
        final fbUser = authResult.user;
        if (fbUser != null) {
          final String code = _businessNameController.text.replaceAll(' ', '_').toLowerCase();
          final String tenantId = 'tenant_${code}_${DateTime.now().millisecondsSinceEpoch.toString().substring(10)}';
          final String businessId = 'biz_${code}';

          final now = DateTime.now();
          final dateStr = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
          final normalizedName = _businessNameController.text
              .toLowerCase()
              .replaceAll(RegExp(r'[^a-z0-9]+'), '_')
              .replaceAll(RegExp(r'^_+|_+$'), '');
          final String businessCode = '${normalizedName}_$dateStr';

          await AuthService.loginWithUser(AppUser(
            id: fbUser.uid,
            name: 'Owner of ${_businessNameController.text}',
            email: _emailController.text,
            tenantId: tenantId,
            businessId: businessId,
            role: UserRole.businessOwner,
          ));

          final provider = Provider.of<CoreProvider>(context, listen: false);
          await provider.seedNewTenant(tenantId, _businessNameController.text, _selectedIndustry);

          await dc.ExampleConnector.instance.createUser(
            tenantId: tenantId,
            businessId: businessId,
            email: _emailController.text,
            role: UserRole.businessOwner.displayName,
          ).fullName('Owner of ${_businessNameController.text}').execute();

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Registered "${_businessNameController.text}"! Code: $businessCode'),
                backgroundColor: Colors.green,
                behavior: SnackBarBehavior.floating,
              ),
            );
            Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Registration failed: ${e.toString()}'),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() => _isLoadingState = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Register Business')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Register Business Tenant',
                style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Create a completely isolated database workspace for your business operational transactions.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _businessNameController,
                decoration: InputDecoration(
                  labelText: 'Business Name',
                  prefixIcon: const Icon(Icons.business),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (value) => value == null || value.isEmpty ? 'Enter business name' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedIndustry,
                decoration: InputDecoration(
                  labelText: 'Industry Sector',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: _industries.map((i) => DropdownMenuItem(value: i, child: Text(i))).toList(),
                onChanged: (val) => setState(() => _selectedIndustry = val!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Admin Email',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (value) => value == null || !value.contains('@') ? 'Invalid email' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Admin Password',
                  prefixIcon: const Icon(Icons.lock_outline),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (value) => value == null || value.length < 8 ? 'Min 8 characters' : null,
              ),
              const SizedBox(height: 32),
              _isLoadingState
                  ? const Center(child: CircularProgressIndicator())
                  : FilledButton(
                      onPressed: _handleRegister,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Create Isolated Tenant Workspace', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
