import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/app_user.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../widgets/auth_layout.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _errorKey = GlobalKey();
  final _fullNameController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _cityController = TextEditingController();
  final _regionController = TextEditingController();
  final _invitationController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedIndustry = 'Retail & Commerce';
  bool _isLoadingState = false;
  bool _obscurePassword = true;
  bool _joiningWorkspace = false;
  String? _error;

  static const _industries = [
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
    if (_isLoadingState || !_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() {
      _isLoadingState = true;
      _error = null;
    });
    try {
      await AuthService.registerOwner(
        name: _fullNameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      await ApiService.request(
        '/api/bootstrap',
        method: 'POST',
        body: {
          'fullName': _fullNameController.text.trim(),
          'businessName': _joiningWorkspace
              ? 'Invited workspace'
              : _businessNameController.text.trim(),
          'businessSector': _joiningWorkspace
              ? 'Invited workspace'
              : _selectedIndustry,
          'location': _joiningWorkspace
              ? 'Invited workspace'
              : [
                  _cityController.text.trim(),
                  _regionController.text.trim(),
                ].join(', '),
          'region': _joiningWorkspace
              ? 'Invited workspace'
              : _regionController.text.trim(),
          if (_joiningWorkspace)
            'invitationToken': _invitationController.text.trim(),
        },
      );
      final registered = await AuthService.refreshCurrentUser();
      if (!mounted) return;
      TextInput.finishAutofillContext();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _joiningWorkspace
                ? 'Your workspace invitation was accepted.'
                : 'Your business workspace is ready.',
          ),
        ),
      );
      Navigator.pushNamedAndRemoveUntil(
        context,
        registered.role == UserRole.staff ? '/tasks' : '/dashboard',
        (route) => false,
      );
    } catch (error) {
      if (mounted) {
        setState(
          () => _error = error.toString().replaceFirst('Exception: ', ''),
        );
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted && _errorKey.currentContext != null) {
            Scrollable.ensureVisible(
              _errorKey.currentContext!,
              duration: const Duration(milliseconds: 200),
            );
          }
        });
      }
    } finally {
      if (mounted) setState(() => _isLoadingState = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthLayout(
      maxWidth: 640,
      title: _joiningWorkspace ? 'Join your workspace' : 'Create your business',
      subtitle: _joiningWorkspace
          ? 'Set up your account to accept your workspace invitation.'
          : 'A home for your inventory, sales and team. Start with a few details.',
      child: AutofillGroup(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              AbsorbPointer(
                absorbing: _isLoadingState,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const AuthSectionHeading(
                      title: 'Your account',
                      description:
                          'These are the details you will use to sign in.',
                      icon: Icons.person_outline_rounded,
                    ),
                    TextFormField(
                      controller: _fullNameController,
                      textCapitalization: TextCapitalization.words,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [AutofillHints.name],
                      decoration: const InputDecoration(
                        labelText: 'Your full name',
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      validator: (value) =>
                          value == null || value.trim().length < 2
                          ? 'Enter your full name'
                          : null,
                    ),
                    const SizedBox(height: 18),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      autofillHints: const [
                        AutofillHints.newUsername,
                        AutofillHints.email,
                      ],
                      autocorrect: false,
                      decoration: const InputDecoration(
                        labelText: 'Email address',
                        hintText: 'you@business.com',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                      validator: (value) =>
                          value == null ||
                              !RegExp(
                                r'^[^\s@]+@[^\s@]+\.[^\s@]+$',
                              ).hasMatch(value.trim())
                          ? 'Enter a valid email address'
                          : null,
                    ),
                    const SizedBox(height: 18),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      autocorrect: false,
                      enableSuggestions: false,
                      autofillHints: const [AutofillHints.newPassword],
                      textInputAction: TextInputAction.next,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        helperText:
                            'At least 8 characters, including an uppercase letter and a number.',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          tooltip: _obscurePassword
                              ? 'Show password'
                              : 'Hide password',
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                          onPressed: () => setState(
                            () => _obscurePassword = !_obscurePassword,
                          ),
                        ),
                      ),
                      validator: (value) => value == null || value.length < 8
                          ? 'Use at least 8 characters'
                          : !RegExp(r'[A-Z]').hasMatch(value) ||
                                !RegExp(r'[0-9]').hasMatch(value)
                          ? 'Include an uppercase letter and a number'
                          : null,
                    ),
                    const SizedBox(height: 24),
                    SwitchListTile.adaptive(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('I have a workspace invitation'),
                      subtitle: const Text(
                        'Use a token from a platform administrator.',
                      ),
                      value: _joiningWorkspace,
                      onChanged: (value) => setState(() {
                        _joiningWorkspace = value;
                        _error = null;
                      }),
                    ),
                    const SizedBox(height: 20),
                    const Divider(),
                    const SizedBox(height: 24),
                    if (_joiningWorkspace) ...[
                      const AuthSectionHeading(
                        title: 'Your invitation',
                        description:
                            'Your invitation sets your business and assigned role.',
                        icon: Icons.mail_outline_rounded,
                      ),
                      TextFormField(
                        key: const ValueKey('invitation-token'),
                        controller: _invitationController,
                        autocorrect: false,
                        enableSuggestions: false,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _handleRegister(),
                        decoration: const InputDecoration(
                          labelText: 'Invitation token',
                          helperText: 'Paste the token shared with you.',
                          prefixIcon: Icon(Icons.key_outlined),
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Enter your invitation token'
                            : null,
                      ),
                    ] else ...[
                      const AuthSectionHeading(
                        title: 'Your business',
                        description: 'Tell us where your team works.',
                        icon: Icons.storefront_outlined,
                      ),
                      TextFormField(
                        key: const ValueKey('registration-business'),
                        controller: _businessNameController,
                        textCapitalization: TextCapitalization.words,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.organizationName],
                        decoration: const InputDecoration(
                          labelText: 'Business name',
                          prefixIcon: Icon(Icons.business_outlined),
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Enter business name'
                            : null,
                      ),
                      const SizedBox(height: 18),
                      DropdownButtonFormField<String>(
                        initialValue: _selectedIndustry,
                        isExpanded: true,
                        decoration: const InputDecoration(
                          labelText: 'Industry',
                        ),
                        items: _industries
                            .map(
                              (industry) => DropdownMenuItem(
                                value: industry,
                                child: Text(
                                  industry,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            )
                            .toList(),
                        onChanged: (value) =>
                            setState(() => _selectedIndustry = value!),
                      ),
                      const SizedBox(height: 18),
                      _locationFields(),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 28),
              if (_error != null) ...[
                AuthErrorMessage(key: _errorKey, message: _error!),
                const SizedBox(height: 12),
                Text(
                  'Your details are still here. Check the message above and try again.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 16),
              ],
              FilledButton(
                onPressed: _isLoadingState ? null : _handleRegister,
                child: AuthSubmitLabel(
                  loading: _isLoadingState,
                  label: _joiningWorkspace
                      ? 'Join workspace'
                      : 'Create business',
                  loadingLabel: _joiningWorkspace
                      ? 'Joining workspace…'
                      : 'Creating workspace…',
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: _isLoadingState
                    ? null
                    : () => Navigator.pushReplacementNamed(context, '/login'),
                child: const Text(
                  'Already have an account? Sign in',
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _locationFields() {
    final city = TextFormField(
      controller: _cityController,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.next,
      autofillHints: const [AutofillHints.addressCity],
      decoration: const InputDecoration(
        labelText: 'City',
        prefixIcon: Icon(Icons.location_city_outlined),
      ),
      validator: (value) =>
          value == null || value.trim().length < 2 ? 'Enter your city' : null,
    );
    final region = TextFormField(
      controller: _regionController,
      textCapitalization: TextCapitalization.words,
      textInputAction: TextInputAction.done,
      onFieldSubmitted: (_) => _handleRegister(),
      autofillHints: const [AutofillHints.addressState],
      decoration: const InputDecoration(
        labelText: 'Region',
        prefixIcon: Icon(Icons.map_outlined),
      ),
      validator: (value) =>
          value == null || value.trim().length < 2 ? 'Enter your region' : null,
    );
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 440) {
          return Column(children: [city, const SizedBox(height: 18), region]);
        }
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: city),
            const SizedBox(width: 16),
            Expanded(child: region),
          ],
        );
      },
    );
  }
}
