import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../models/app_user.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import 'dart:ui';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _accessCodeController = TextEditingController();

  String _selectedRoleProfile = 'Staff';
  bool _useEmployeeAccess = false;
  bool _isLoadingState = false;
  bool _obscurePassword = true;

  final List<String> _roleOptions = ['Manager', 'Staff'];
  bool get _usesEmployeeCode => _useEmployeeAccess;

  Future<void> _forgotPassword() async {
    final email = TextEditingController(text: _emailController.text.trim());
    final send = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Reset password'),
        content: TextField(
          controller: email,
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(labelText: 'Account email'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Send reset email'),
          ),
        ],
      ),
    );
    if (send == true && email.text.contains('@')) {
      try {
        await AuthService.requestPasswordReset(email.text);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'If the account exists, a reset link has been sent.',
              ),
            ),
          );
        }
      } catch (error) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error.toString()),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
    email.dispose();
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
      // Platform administrators have no tenant context. Keeping tenant data
      // from a previous login would both leak stale UI state and cause tenant
      // API calls to fail before the SaaS control center can open.
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
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoadingState = true);
      try {
        final user = await AuthService.login(
          useEmployeeAccess: _useEmployeeAccess,
          roleProfile: _selectedRoleProfile,
          fullName: _fullNameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
          businessName: _businessNameController.text.trim(),
          accessCode: _accessCodeController.text.trim(),
        );
        if (!mounted) return;
        if (user != null) {
          await _loadAllProviderData();
          if (!mounted) return;
          Navigator.pushReplacementNamed(
            context,
            user.role == UserRole.platformSuperAdmin
                ? '/admin/dashboard'
                : user.role == UserRole.staff
                ? '/tasks'
                : '/dashboard',
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Login failed: ${e.toString().replaceAll('Exception: ', '')}',
              ),
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
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  theme.colorScheme.primary.withValues(alpha: 0.05),
                  theme.colorScheme.surface,
                  theme.colorScheme.secondary.withValues(alpha: 0.05),
                ],
              ),
            ),
          ),

          // Glassmorphism login card
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(32),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      width: size.width > 600 ? 500 : double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(
                          color: theme.colorScheme.outlineVariant.withValues(
                            alpha: 0.5,
                          ),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 24,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // Brand Header
                            Center(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withValues(
                                    alpha: 0.1,
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.business_center_rounded,
                                  size: 48,
                                  color: theme.colorScheme.primary,
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              'Welcome to SmartERP',
                              textAlign: TextAlign.center,
                              style: theme.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'AI-Powered SME Operations Platform',
                              textAlign: TextAlign.center,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: Colors.grey.shade500,
                              ),
                            ),
                            const SizedBox(height: 32),

                            const SizedBox(height: 24),

                            DropdownButtonFormField<bool>(
                              initialValue: _useEmployeeAccess,
                              decoration: const InputDecoration(
                                labelText: 'Sign-in method',
                                prefixIcon: Icon(Icons.login_outlined),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: false,
                                  child: Text('Email and password'),
                                ),
                                DropdownMenuItem(
                                  value: true,
                                  child: Text('Team access code'),
                                ),
                              ],
                              onChanged: (value) => setState(
                                () => _useEmployeeAccess = value ?? false,
                              ),
                            ),
                            const SizedBox(height: 16),

                            if (_usesEmployeeCode) ...[
                              DropdownButtonFormField<String>(
                                initialValue: _selectedRoleProfile,
                                decoration: const InputDecoration(
                                  labelText: 'Team role',
                                  prefixIcon: Icon(Icons.badge_outlined),
                                ),
                                items: _roleOptions
                                    .map(
                                      (role) => DropdownMenuItem(
                                        value: role,
                                        child: Text(role),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (value) => setState(
                                  () => _selectedRoleProfile = value ?? 'Staff',
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _fullNameController,
                                decoration: const InputDecoration(
                                  labelText: 'Full Name',
                                  prefixIcon: Icon(Icons.badge_outlined),
                                ),
                                validator: (value) =>
                                    value == null || value.trim().isEmpty
                                    ? 'Please enter your registered name'
                                    : null,
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _businessNameController,
                                textCapitalization: TextCapitalization.words,
                                decoration: const InputDecoration(
                                  labelText: 'Registered Business Name',
                                  hintText: 'Enter the exact business name',
                                  prefixIcon: Icon(Icons.domain_outlined),
                                ),
                                validator: (value) =>
                                    value == null || value.trim().isEmpty
                                    ? 'Business name is required'
                                    : null,
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _accessCodeController,
                                textCapitalization:
                                    TextCapitalization.characters,
                                decoration: InputDecoration(
                                  labelText: 'Access Code',
                                  hintText: 'EMP-XXXXXX-XXXXXXXX',
                                  prefixIcon: const Icon(Icons.key_outlined),
                                ),
                                validator: (value) =>
                                    value == null || value.trim().isEmpty
                                    ? 'Your unique access code is required'
                                    : null,
                              ),
                            ] else ...[
                              TextFormField(
                                controller: _emailController,
                                keyboardType: TextInputType.emailAddress,
                                decoration: const InputDecoration(
                                  labelText: 'Email Address',
                                  prefixIcon: Icon(Icons.email_outlined),
                                ),
                                validator: (value) =>
                                    value == null || !value.contains('@')
                                    ? 'Invalid registered email address'
                                    : null,
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                decoration: InputDecoration(
                                  labelText: 'Password',
                                  prefixIcon: const Icon(Icons.lock_outline),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword
                                          ? Icons.visibility
                                          : Icons.visibility_off,
                                    ),
                                    onPressed: () => setState(
                                      () =>
                                          _obscurePassword = !_obscurePassword,
                                    ),
                                  ),
                                ),
                                validator: (value) =>
                                    value == null || value.isEmpty
                                    ? 'Please enter your password'
                                    : null,
                              ),
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: _forgotPassword,
                                  child: const Text('Forgot password?'),
                                ),
                              ),
                            ],
                            const SizedBox(height: 32),

                            _isLoadingState
                                ? const Center(
                                    child: CircularProgressIndicator(),
                                  )
                                : FilledButton(
                                    onPressed: _handleLogin,
                                    style: FilledButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 16,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                    ),
                                    child: const Text(
                                      'Sign In',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        letterSpacing: 1.1,
                                      ),
                                    ),
                                  ),
                            const SizedBox(height: 24),

                            Center(
                              child: TextButton(
                                onPressed: () =>
                                    Navigator.pushNamed(context, '/register'),
                                child: const Text(
                                  'Don\'t have an account? Register',
                                  style: TextStyle(fontWeight: FontWeight.w600),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
