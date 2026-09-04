import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../services/data_api.dart';
import '../widgets/app_drawer.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currency = TextEditingController(text: 'FCFA');
  final _timezone = TextEditingController(text: 'Africa/Douala');
  final _fiscalYear = TextEditingController(text: '01-01');
  final _taxRate = TextEditingController(text: '0');
  final _lowStock = TextEditingController(text: '10');
  bool _loading = true;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _currency.dispose();
    _timezone.dispose();
    _fiscalYear.dispose();
    _taxRate.dispose();
    _lowStock.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await DataApi.operation('getBusinessSettings');
      final values = (data['businessSettings'] as List<dynamic>? ?? const []);
      if (values.isNotEmpty) {
        final settings = values.first as Map<String, dynamic>;
        _currency.text = settings['currency']?.toString() ?? 'FCFA';
        _timezone.text = settings['timezone']?.toString() ?? 'Africa/Douala';
        _fiscalYear.text = settings['fiscalYearStart']?.toString() ?? '01-01';
        _taxRate.text = settings['taxRate']?.toString() ?? '0';
        _lowStock.text = settings['lowStockThreshold']?.toString() ?? '10';
      }
    } catch (error) {
      _error = error.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await DataApi.operation('UpsertBusinessSettings', {
        'currency': _currency.text.trim().toUpperCase(),
        'timezone': _timezone.text.trim(),
        'fiscalYearStart': _fiscalYear.text.trim(),
        'taxRate': double.parse(_taxRate.text),
        'lowStockThreshold': int.parse(_lowStock.text),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Workspace settings saved.')),
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
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String? _number(Object? value) =>
      double.tryParse(value?.toString() ?? '') == null
      ? 'Enter a valid number'
      : null;

  @override
  Widget build(BuildContext context) {
    final canManage = AuthService.hasPermission('company:manage');
    return Scaffold(
      appBar: AppBar(title: const Text('Workspace settings')),
      drawer: const AppDrawer(currentRoute: '/settings'),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? Center(
              child: FilledButton.icon(
                onPressed: _load,
                icon: const Icon(Icons.refresh),
                label: Text(_error!),
              ),
            )
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  Text(
                    'Appearance',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 10),
                  Card(
                    child: SwitchListTile(
                      title: const Text('Dark theme'),
                      subtitle: const Text('Stored on this device'),
                      value:
                          context.watch<ThemeProvider>().themeMode ==
                          ThemeMode.dark,
                      onChanged: (_) =>
                          context.read<ThemeProvider>().toggleThemeMode(),
                    ),
                  ),
                  const SizedBox(height: 22),
                  Text(
                    'Business defaults',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _currency,
                    enabled: canManage,
                    decoration: const InputDecoration(
                      labelText: 'Currency code',
                    ),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Required'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _timezone,
                    enabled: canManage,
                    decoration: const InputDecoration(labelText: 'Timezone'),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Required'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _fiscalYear,
                    enabled: canManage,
                    decoration: const InputDecoration(
                      labelText: 'Fiscal year start',
                      helperText: 'MM-DD, for example 01-01',
                    ),
                    validator: (value) =>
                        RegExp(r'^\d{2}-\d{2}$').hasMatch(value ?? '')
                        ? null
                        : 'Use MM-DD',
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _taxRate,
                    enabled: canManage,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Default tax rate (%)',
                    ),
                    validator: _number,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _lowStock,
                    enabled: canManage,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Low-stock threshold',
                    ),
                    validator: _number,
                  ),
                  const SizedBox(height: 20),
                  if (canManage)
                    FilledButton.icon(
                      onPressed: _saving ? null : _save,
                      icon: const Icon(Icons.save_outlined),
                      label: Text(_saving ? 'Saving…' : 'Save settings'),
                    ),
                ],
              ),
            ),
    );
  }
}
