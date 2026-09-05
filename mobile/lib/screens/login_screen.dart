import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../models/app_user.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../widgets/auth_layout.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _errorKey = GlobalKey();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _accessCodeController = TextEditingController();
  String _selectedRoleProfile = 'Staff';
  bool _useEmployeeAccess = false;
  bool _isLoadingState = false;
  bool _obscurePassword = true;
  String? _error;

  Future<void> _forgotPassword() async {
    final email = TextEditingController(text: _emailController.text.trim());
    final resetFormKey = GlobalKey<FormState>();
    final send = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Reset password'),
        content: Form(
          key: resetFormKey,
          child: TextFormField(
            controller: email,
            autofocus: true,
            keyboardType: TextInputType.emailAddress,
            autofillHints: const [AutofillHints.email],
            decoration: const InputDecoration(labelText: 'Account email'),
            validator: (value) =>
                value == null ||
                    !RegExp(
                      r'^[^\s@]+@[^\s@]+\.[^\s@]+$',
                    ).hasMatch(value.trim())
                ? 'Enter a valid email address'
                : null,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              if (resetFormKey.currentState!.validate()) {
                Navigator.pop(dialogContext, true);
              }
            },
            child: const Text('Send reset email'),
          ),
        ],
      ),
    );
    final resetEmail = email.text.trim();
    // The dialog's TextField remains mounted during its dismissal animation.
    await Future<void>.delayed(const Duration(milliseconds: 250));
    email.dispose();
    if (send != true || !mounted) return;
    setState(() {
      _isLoadingState = true;
      _error = null;
    });
    try {
      await AuthService.requestPasswordReset(resetEmail);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('If the account exists, a reset link has been sent.'),
          ),
        );
      }
    } catch (error) {
      if (mounted) _showError(error);
    } finally {
      if (mounted) setState(() => _isLoadingState = false);
    }
  }

  void _showError(Object error) {
    setState(() => _error = error.toString().replaceFirst('Exception: ', ''));
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && _errorKey.currentContext != null) {
        Scrollable.ensureVisible(
          _errorKey.currentContext!,
          duration: const Duration(milliseconds: 200),
        );
      }
    });
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _businessNameController.dispose();
    _accessCodeController.dispose();
    super.dispose();
  }

  Future<void> _loadAllProviderData() async {
    final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(
      context,
      listen: false,
    );
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);

    if (AuthService.currentUser?.role == UserRole.platformSuperAdmin) {
      core.reset();
      inventory.reset();
      transaction.reset();
      taskProvider.reset();
    } else if (AuthService.currentUser?.role == UserRole.staff) {
      core.reset();
      inventory.reset();
      transaction.reset();
      await taskProvider.loadData();
    } else {
      await Future.wait([
        core.loadData(),
        inventory.loadData(),
        transaction.loadData(),
        taskProvider.loadData(),
      ]);
    }
  }

  void _handleLogin() async {
    if (_isLoadingState || !_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    setState(() {
      _isLoadingState = true;
      _error = null;
    });
    try {
      final user = await AuthService.login(
        useEmployeeAccess: _useEmployeeAccess,
        roleProfile: _selectedRoleProfile,
        fullName: _fullNameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        businessName: _businessNameController.text.trim(),
        accessCode: _accessCodeController.text.trim(),
      );
      if (!mounted) return;
      if (user != null) {
        await _loadAllProviderData();
        if (!mounted) return;
        TextInput.finishAutofillContext();
        Navigator.pushReplacementNamed(
          context,
          user.role == UserRole.platformSuperAdmin
              ? '/admin/dashboard'
              : user.role == UserRole.staff
              ? '/tasks'
              : '/dashboard',
        );
      }
    } catch (error) {
      if (mounted) _showError(error);
    } finally {
      if (mounted) setState(() => _isLoadingState = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AuthLayout(
      title: 'Welcome back',
      subtitle:
          'Sign in to your business workspace and pick up where you left off.',
      child: AutofillGroup(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Sign-in method', style: theme.textTheme.titleSmall),
              const SizedBox(height: 10),
              SegmentedButton<bool>(
                segments: const [
                  ButtonSegment(value: false, label: Text('Email')),
                  ButtonSegment(value: true, label: Text('Team code')),
                ],
                selected: {_useEmployeeAccess},
                showSelectedIcon: false,
                style: SegmentedButton.styleFrom(
                  minimumSize: const Size(0, 48),
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                ),
                onSelectionChanged: _isLoadingState
                    ? null
                    : (value) {
                        _formKey.currentState?.reset();
                        setState(() {
                          _useEmployeeAccess = value.first;
                          _error = null;
                        });
                      },
              ),
              const SizedBox(height: 12),
              Text(
                _useEmployeeAccess
                    ? 'Managers and staff: use the details shared by your business owner.'
                    : 'Use your email and password. Your assigned role opens the right workspace.',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 24),
              AbsorbPointer(
                absorbing: _isLoadingState,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_useEmployeeAccess) ...[
                      DropdownButtonFormField<String>(
                        key: const ValueKey('team-role'),
                        initialValue: _selectedRoleProfile,
                        isExpanded: true,
                        decoration: const InputDecoration(
                          labelText: 'Team role',
                          prefixIcon: Icon(Icons.badge_outlined),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'Manager',
                            child: Text('Manager'),
                          ),
                          DropdownMenuItem(
                            value: 'Staff',
                            child: Text('Staff'),
                          ),
                        ],
                        onChanged: (value) => setState(
                          () => _selectedRoleProfile = value ?? 'Staff',
                        ),
                      ),
                      const SizedBox(height: 18),
                      TextFormField(
                        controller: _fullNameController,
                        textCapitalization: TextCapitalization.words,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.name],
                        decoration: const InputDecoration(
                          labelText: 'Full name',
                          prefixIcon: Icon(Icons.person_outline_rounded),
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Please enter your registered name'
                            : null,
                      ),
                      const SizedBox(height: 18),
                      TextFormField(
                        controller: _businessNameController,
                        textCapitalization: TextCapitalization.words,
                        textInputAction: TextInputAction.next,
                        decoration: const InputDecoration(
                          labelText: 'Business name',
                          helperText:
                              'Use the exact name given by your business owner.',
                          prefixIcon: Icon(Icons.domain_outlined),
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Business name is required'
                            : null,
                      ),
                      const SizedBox(height: 18),
                      TextFormField(
                        controller: _accessCodeController,
                        autocorrect: false,
                        enableSuggestions: false,
                        textCapitalization: TextCapitalization.characters,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _handleLogin(),
                        decoration: const InputDecoration(
                          labelText: 'Access code',
                          hintText: 'EMP-XXXXXX-XXXXXXXX',
                          prefixIcon: Icon(Icons.key_outlined),
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Your unique access code is required'
                            : null,
                      ),
                    ] else ...[
                      TextFormField(
                        key: const ValueKey('login-email'),
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [
                          AutofillHints.username,
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
                            ? 'Invalid registered email address'
                            : null,
                      ),
                      const SizedBox(height: 18),
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        enableSuggestions: false,
                        autocorrect: false,
                        autofillHints: const [AutofillHints.password],
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _handleLogin(),
                        decoration: InputDecoration(
                          labelText: 'Password',
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
                        validator: (value) => value == null || value.isEmpty
                            ? 'Please enter your password'
                            : null,
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: _isLoadingState ? null : _forgotPassword,
                          child: const Text('Forgot password?'),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (_error != null) ...[
                AuthErrorMessage(key: _errorKey, message: _error!),
                const SizedBox(height: 16),
              ],
              FilledButton(
                onPressed: _isLoadingState ? null : _handleLogin,
                child: AuthSubmitLabel(
                  loading: _isLoadingState,
                  label: 'Sign in',
                  loadingLabel: 'Signing in…',
                ),
              ),
              const SizedBox(height: 20),
              const Divider(),
              const SizedBox(height: 12),
              TextButton(
                onPressed: _isLoadingState
                    ? null
                    : () => Navigator.pushNamed(context, '/register'),
                child: const Text(
                  'New business? Create an account',
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
