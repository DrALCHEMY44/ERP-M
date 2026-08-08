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
  
  // Controllers with pre-seeded values for Samuel Eto'o (Business Owner)
  final _fullNameController = TextEditingController(text: "Samuel Eto'o");
  final _emailController = TextEditingController(text: 'admin@smarterp.ai');
  final _passwordController = TextEditingController(text: 'password123');
  final _businessNameController = TextEditingController();
  final _accessCodeController = TextEditingController();
  
  String _selectedRoleProfile = 'Business Owner';
  bool _isLoadingState = false;
  bool _obscurePassword = true;

  final List<String> _roleOptions = ['Business Owner', 'Manager', 'Employee'];
  bool get _usesEmployeeCode => _selectedRoleProfile != 'Business Owner';

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _businessNameController.dispose();
    _accessCodeController.dispose();
    super.dispose();
  }

  String _getDemoRoleProfile(UserRole role) {
    switch (role) {
      case UserRole.businessOwner:
        return 'Business Owner';
      case UserRole.manager:
        return 'Manager';
      default:
        return 'Employee';
    }
  }

  Future<void> _loadAllProviderData() async {
    final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);

    if (AuthService.currentUser?.role == UserRole.staff) {
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
          Navigator.pushReplacementNamed(context, user.role == UserRole.staff ? '/tasks' : '/dashboard');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Login failed: ${e.toString().replaceAll('Exception: ', '')}'),
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

  void _handleDemoLogin(AppUser user) async {
    setState(() {
      _selectedRoleProfile = _getDemoRoleProfile(user.role);
      _fullNameController.text = user.name;
      _emailController.text = user.email;
      _passwordController.text = 'password123';
      _isLoadingState = true;
    });

    try {
      final loggedInUser = await AuthService.loginWithUser(user);
      if (!mounted) return;
      if (loggedInUser != null) {
        await _loadAllProviderData();
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Logged in as ${loggedInUser.name} (${loggedInUser.role.displayName})'),
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Demo login failed: ${e.toString().replaceAll('Exception: ', '')}'),
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

  void _showDemoAccountsPanel() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      builder: (context) {
        final theme = Theme.of(context);
        return Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Quick Demo Accounts',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const Icon(Icons.flash_on, color: Colors.amber),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Select a pre-seeded account to test tenant-isolation and role-based views instantly.',
                style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey.shade600),
              ),
              const SizedBox(height: 24),
              ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.45,
                ),
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: AuthService.demoUsers.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final user = AuthService.demoUsers[index];
                    final isDouala = user.tenantId == 'tenant_douala_001';
                    
                    return Card(
                      elevation: 0,
                      color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(color: theme.colorScheme.outlineVariant.withOpacity(0.3)),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        leading: CircleAvatar(
                          backgroundColor: isDouala ? Colors.blue.withOpacity(0.1) : Colors.teal.withOpacity(0.1),
                          child: Icon(
                            user.role == UserRole.businessOwner ? Icons.workspace_premium : Icons.person,
                            color: isDouala ? Colors.blue : Colors.teal,
                          ),
                        ),
                        title: Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${user.role.displayName}\n${isDouala ? "Superette de l'Avenir (Douala)" : "Boutique Bastos (Yaoundé)"}', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                        isThreeLine: true,
                        trailing: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.arrow_forward_ios, size: 14, color: theme.colorScheme.primary),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          _handleDemoLogin(user);
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          ),
        );
      },
    );
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
                  theme.colorScheme.primary.withOpacity(0.05),
                  theme.colorScheme.surface,
                  theme.colorScheme.secondary.withOpacity(0.05),
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
                        color: theme.colorScheme.surface.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.5)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 24,
                            offset: const Offset(0, 8),
                          )
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
                                  color: theme.colorScheme.primary.withOpacity(0.1),
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
                            
                            // Demo Quick Access Card
                            InkWell(
                              onTap: _showDemoAccountsPanel,
                              borderRadius: BorderRadius.circular(16),
                              child: Ink(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      theme.colorScheme.primary.withOpacity(0.1),
                                      theme.colorScheme.secondary.withOpacity(0.05),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: theme.colorScheme.primary.withOpacity(0.2),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(Icons.flash_on, color: theme.colorScheme.primary, size: 24),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Quick-Login for Demo',
                                              style: theme.textTheme.titleMedium?.copyWith(
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              'Tap to pick role & tenant',
                                              style: theme.textTheme.bodySmall?.copyWith(
                                                color: Colors.grey.shade600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Icon(Icons.keyboard_arrow_right, color: theme.colorScheme.primary),
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 32),
                            
                            Row(
                              children: [
                                Expanded(child: Divider(color: theme.colorScheme.outlineVariant)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                                  child: Text('OR LOGIN MANUALLY', style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey.shade500, letterSpacing: 1.2)),
                                ),
                                Expanded(child: Divider(color: theme.colorScheme.outlineVariant)),
                              ],
                            ),

                            const SizedBox(height: 24),

                            // 1. Role Profile
                            DropdownButtonFormField<String>(
                              initialValue: _selectedRoleProfile,
                              decoration: const InputDecoration(
                                labelText: 'Role Profile',
                                prefixIcon: Icon(Icons.person_outline),
                              ),
                              items: _roleOptions.map((role) => DropdownMenuItem(
                                value: role,
                                child: Text(role),
                              )).toList(),
                              onChanged: (val) => setState(() => _selectedRoleProfile = val!),
                            ),
                            const SizedBox(height: 16),
                            
                            // 2. Registered Full Name
                            TextFormField(
                              controller: _fullNameController,
                              decoration: const InputDecoration(
                                labelText: 'Full Name',
                                prefixIcon: Icon(Icons.badge_outlined),
                              ),
                              validator: (value) =>
                                  value == null || value.trim().isEmpty ? 'Please enter your registered name' : null,
                            ),
                            const SizedBox(height: 16),

                            if (_usesEmployeeCode) ...[
                              TextFormField(
                                controller: _businessNameController,
                                textCapitalization: TextCapitalization.words,
                                decoration: const InputDecoration(
                                  labelText: 'Registered Business Name',
                                  hintText: 'Enter the exact business name',
                                  prefixIcon: Icon(Icons.domain_outlined),
                                ),
                                validator: (value) => value == null || value.trim().isEmpty
                                    ? 'Business name is required'
                                    : null,
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _accessCodeController,
                                textCapitalization: TextCapitalization.characters,
                                decoration: InputDecoration(
                                  labelText: _selectedRoleProfile == 'Manager' ? 'Manager Code' : 'Employee Code',
                                  hintText: 'EMP-XXXXXX-XXXXXXXX',
                                  prefixIcon: const Icon(Icons.key_outlined),
                                ),
                                validator: (value) => value == null || value.trim().isEmpty
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
                                validator: (value) => value == null || !value.contains('@')
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
                                    icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                  ),
                                ),
                                validator: (value) => value == null || value.isEmpty
                                    ? 'Please enter your password'
                                    : null,
                              ),
                            ],
                            const SizedBox(height: 32),
                            
                            _isLoadingState
                                ? const Center(child: CircularProgressIndicator())
                                : FilledButton(
                                    onPressed: _handleLogin,
                                    style: FilledButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    ),
                                    child: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 1.1)),
                                  ),
                            const SizedBox(height: 24),
                            
                            Center(
                              child: TextButton(
                                onPressed: () => Navigator.pushNamed(context, '/register'),
                                child: const Text('Don\'t have an account? Register', style: TextStyle(fontWeight: FontWeight.w600)),
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
