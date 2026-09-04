import 'package:flutter/material.dart';
import '../models/app_user.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _regionController = TextEditingController();
  final _invitationController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedIndustry = 'Retail & Commerce';
  bool _isLoadingState = false;

  final List<String> _industries = [
    'Retail & Commerce',
    'Agriculture & Agribusiness',
    'Construction & Real Estate',
    'Healthcare & Pharmaceuticals',
    'Education & Training',
    'Technology & Digital Services',
    'Transportation & Logistics',
    'Food & Beverage',
    'Manufacturing & Industry',
    'Financial Services',
    'Hospitality & Tourism',
    'General Services',
  ];

  @override
  void dispose() {
    _fullNameController.dispose();
    _businessNameController.dispose();
    _cityController.dispose();
    _regionController.dispose();
    _invitationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoadingState = true);
      try {
        await AuthService.registerOwner(
          name: _fullNameController.text.trim(),
          email: _emailController.text,
          password: _passwordController.text,
        );
        await ApiService.request(
          '/api/bootstrap',
          method: 'POST',
          body: {
            'fullName': _fullNameController.text.trim(),
            'businessName': _invitationController.text.trim().isEmpty
                ? _businessNameController.text.trim()
                : 'Invited workspace',
            'businessSector': _invitationController.text.trim().isEmpty
                ? _selectedIndustry
                : 'Invited workspace',
            'location': _invitationController.text.trim().isEmpty
                ? '${_cityController.text.trim()}, ${_regionController.text.trim()}'
                : 'Invited workspace',
            'region': _invitationController.text.trim().isEmpty
                ? _regionController.text.trim()
                : 'Invited workspace',
            if (_invitationController.text.trim().isNotEmpty)
              'invitationToken': _invitationController.text.trim(),
          },
        );
        final registered = await AuthService.refreshCurrentUser();
        if (!mounted) return;

        if (mounted) {
          final invited = _invitationController.text.trim().isNotEmpty;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                invited
                    ? 'Your workspace invitation was accepted.'
                    : 'Created workspace "${_businessNameController.text}".',
              ),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
            ),
          );
          Navigator.pushNamedAndRemoveUntil(
            context,
            registered.role == UserRole.staff ? '/tasks' : '/dashboard',
            (route) => false,
          );
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
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Create a completely isolated database workspace for your business operational transactions.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _fullNameController,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(
                  labelText: 'Your full name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (value) => value == null || value.trim().length < 2
                    ? 'Enter your full name'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _businessNameController,
                decoration: InputDecoration(
                  labelText: 'Business Name',
                  prefixIcon: const Icon(Icons.business),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) =>
                    _invitationController.text.trim().isEmpty &&
                        (value == null || value.trim().isEmpty)
                    ? 'Enter business name'
                    : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedIndustry,
                decoration: InputDecoration(
                  labelText: 'Industry Sector',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                items: _industries
                    .map((i) => DropdownMenuItem(value: i, child: Text(i)))
                    .toList(),
                onChanged: (val) => setState(() => _selectedIndustry = val!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _cityController,
                decoration: const InputDecoration(
                  labelText: 'City',
                  prefixIcon: Icon(Icons.location_city_outlined),
                ),
                validator: (value) =>
                    _invitationController.text.trim().isEmpty &&
                        (value == null || value.trim().length < 2)
                    ? 'Enter your city'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _regionController,
                decoration: const InputDecoration(
                  labelText: 'Region',
                  prefixIcon: Icon(Icons.map_outlined),
                ),
                validator: (value) =>
                    _invitationController.text.trim().isEmpty &&
                        (value == null || value.trim().length < 2)
                    ? 'Enter your region'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Admin Email',
                  prefixIcon: const Icon(Icons.email_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) => value == null || !value.contains('@')
                    ? 'Invalid email'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Admin Password',
                  prefixIcon: const Icon(Icons.lock_outline),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) => value == null || value.length < 8
                    ? 'Use at least 8 characters'
                    : !RegExp(r'[A-Z]').hasMatch(value) ||
                          !RegExp(r'[0-9]').hasMatch(value)
                    ? 'Include an uppercase letter and a number'
                    : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _invitationController,
                decoration: const InputDecoration(
                  labelText: 'Workspace invitation token (optional)',
                  prefixIcon: Icon(Icons.mail_outline),
                  helperText:
                      'Use this only when a platform admin invited you.',
                ),
              ),
              const SizedBox(height: 32),
              _isLoadingState
                  ? const Center(child: CircularProgressIndicator())
                  : FilledButton(
                      onPressed: _handleRegister,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Create Isolated Tenant Workspace',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
