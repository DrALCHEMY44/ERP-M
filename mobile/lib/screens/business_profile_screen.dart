import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/data_api.dart';
import '../widgets/app_drawer.dart';

class BusinessProfileScreen extends StatefulWidget {
  const BusinessProfileScreen({super.key});

  @override
  State<BusinessProfileScreen> createState() => _BusinessProfileScreenState();
}

class _BusinessProfileScreenState extends State<BusinessProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fields = <String, TextEditingController>{
    for (final key in [
      'name',
      'businessType',
      'entityType',
      'taxId',
      'phone',
      'email',
      'city',
      'region',
      'location',
      'description',
    ])
      key: TextEditingController(),
  };
  bool _loading = true;
  bool _saving = false;
  String? _error;
  String? _logoUrl;

  bool get _canEdit => AuthService.hasPermission('company:manage');

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    for (final controller in _fields.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await DataApi.operation('getBusinessById');
      final business =
          data['business'] as Map<String, dynamic>? ??
          data['business_get'] as Map<String, dynamic>? ??
          const <String, dynamic>{};
      for (final entry in _fields.entries) {
        entry.value.text = business[entry.key]?.toString() ?? '';
      }
      _logoUrl = business['logoUrl']?.toString();
    } catch (error) {
      _error = error.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _pickLogo() async {
    final file = await FilePicker.pickFile(type: FileType.image);
    if (file == null) return;
    setState(() => _saving = true);
    try {
      final uploaded = await ApiService.uploadFile(file);
      setState(() => _logoUrl = uploaded['fileUrl']?.toString());
    } catch (error) {
      _show(error.toString(), error: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await DataApi.operation('UpdateBusiness', {
        for (final entry in _fields.entries) entry.key: entry.value.text.trim(),
        'logoUrl': _logoUrl,
      });
      _show('Business profile updated.');
      await _load();
    } catch (error) {
      _show(error.toString(), error: true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _show(String message, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: error ? Colors.red : null,
      ),
    );
  }

  Widget _field(
    String key,
    String label, {
    int lines = 1,
    TextInputType? type,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextFormField(
        controller: _fields[key],
        enabled: _canEdit && !_saving,
        keyboardType: type,
        maxLines: lines,
        decoration: InputDecoration(labelText: label),
        validator: key == 'name'
            ? (value) => value == null || value.trim().isEmpty
                  ? 'Business name is required'
                  : null
            : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business profile'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/business-profile'),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(_error!, textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    FilledButton.icon(
                      onPressed: _load,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            )
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 34,
                            backgroundImage:
                                _logoUrl?.startsWith('http') == true
                                ? NetworkImage(_logoUrl!)
                                : null,
                            child: _logoUrl == null
                                ? const Icon(Icons.apartment, size: 32)
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              _canEdit
                                  ? 'Company identity shown across SmartERP'
                                  : 'Company details (read only)',
                            ),
                          ),
                          if (_canEdit)
                            IconButton(
                              onPressed: _saving ? null : _pickLogo,
                              icon: const Icon(Icons.upload),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  _field('name', 'Business name'),
                  Row(
                    children: [
                      Expanded(
                        child: _field('businessType', 'Business sector'),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: _field('entityType', 'Entity type')),
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(child: _field('taxId', 'Tax ID')),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _field(
                          'phone',
                          'Phone',
                          type: TextInputType.phone,
                        ),
                      ),
                    ],
                  ),
                  _field(
                    'email',
                    'Business email',
                    type: TextInputType.emailAddress,
                  ),
                  Row(
                    children: [
                      Expanded(child: _field('city', 'City')),
                      const SizedBox(width: 12),
                      Expanded(child: _field('region', 'Region')),
                    ],
                  ),
                  _field('location', 'Address / location'),
                  _field('description', 'Description', lines: 4),
                  if (_canEdit)
                    FilledButton.icon(
                      onPressed: _saving ? null : _save,
                      icon: _saving
                          ? const SizedBox.square(
                              dimension: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.save_outlined),
                      label: const Text('Save business profile'),
                    ),
                ],
              ),
            ),
    );
  }
}
