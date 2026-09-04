import 'package:flutter/material.dart';

import '../models/app_user.dart';
import '../services/auth_service.dart';
import '../services/data_api.dart';
import '../widgets/app_drawer.dart';

enum BusinessModule { employees, customers, suppliers, documents, settings }

class BusinessModuleScreen extends StatefulWidget {
  final BusinessModule module;
  const BusinessModuleScreen({super.key, required this.module});

  @override
  State<BusinessModuleScreen> createState() => _BusinessModuleScreenState();
}

class _BusinessModuleScreenState extends State<BusinessModuleScreen> {
  List<Map<String, dynamic>> _rows = const [];
  bool _loading = true;
  String? _error;
  String _query = '';

  String get _title => switch (widget.module) {
    BusinessModule.employees => 'Employees',
    BusinessModule.customers => 'Customers',
    BusinessModule.suppliers => 'Suppliers',
    BusinessModule.documents => 'Documents',
    BusinessModule.settings => 'Settings',
  };
  String get _listOperation => switch (widget.module) {
    BusinessModule.employees => 'listEmployeesByBusiness',
    BusinessModule.customers => 'listCustomersByBusiness',
    BusinessModule.suppliers => 'listSuppliersByBusiness',
    _ => '',
  };
  String get _listKey => switch (widget.module) {
    BusinessModule.employees => 'employees',
    BusinessModule.customers => 'customers',
    BusinessModule.suppliers => 'suppliers',
    _ => '',
  };
  bool get _canManage => switch (widget.module) {
    BusinessModule.employees => AuthService.hasPermission('manageEmployees'),
    BusinessModule.customers => AuthService.hasPermission('manageCustomers'),
    BusinessModule.suppliers => AuthService.hasPermission('manageSuppliers'),
    _ => false,
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await DataApi.operation(_listOperation);
      _rows = (data[_listKey] as List<dynamic>? ?? const [])
          .cast<Map<String, dynamic>>();
    } catch (error) {
      _error = error.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  TextEditingController _controller(Map<String, dynamic>? row, String key) =>
      TextEditingController(text: row?[key]?.toString() ?? '');

  Future<void> _edit(Map<String, dynamic>? row) async {
    switch (widget.module) {
      case BusinessModule.employees:
        await _employeeDialog(row);
        break;
      case BusinessModule.customers:
        await _customerDialog(row);
        break;
      case BusinessModule.suppliers:
        await _supplierDialog(row);
        break;
      default:
        break;
    }
  }

  Future<void> _employeeDialog(Map<String, dynamic>? row) async {
    final name = _controller(row, 'fullName');
    final position = _controller(row, 'position');
    final department = _controller(row, 'department');
    final email = _controller(row, 'email');
    final contact = _controller(row, 'contact');
    final salary = _controller(row, 'salary');
    var role = row?['role']?.toString() == 'Manager' ? 'Manager' : 'Staff';
    var status = row?['status']?.toString() ?? 'Active';
    final isOwner = AuthService.currentUser?.role == UserRole.businessOwner;
    if (!isOwner) role = 'Staff';
    final formKey = GlobalKey<FormState>();
    final save = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(row == null ? 'Add employee and login' : 'Edit employee'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(
                      controller: name,
                      decoration: const InputDecoration(labelText: 'Full name'),
                      validator: _required,
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: position,
                      decoration: const InputDecoration(labelText: 'Position'),
                      validator: _required,
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: department,
                      decoration: const InputDecoration(
                        labelText: 'Department',
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: email,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Login email',
                      ),
                      validator: (value) => value != null && value.contains('@')
                          ? null
                          : 'Enter a valid email',
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: contact,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(labelText: 'Contact'),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: salary,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Salary'),
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      initialValue: role,
                      decoration: const InputDecoration(
                        labelText: 'Application role',
                      ),
                      items: (isOwner ? ['Manager', 'Staff'] : ['Staff'])
                          .map(
                            (value) => DropdownMenuItem(
                              value: value,
                              child: Text(value),
                            ),
                          )
                          .toList(),
                      onChanged: (value) =>
                          setDialogState(() => role = value ?? 'Staff'),
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      initialValue:
                          ['Active', 'Inactive', 'On Leave'].contains(status)
                          ? status
                          : 'Active',
                      decoration: const InputDecoration(labelText: 'Status'),
                      items: ['Active', 'Inactive', 'On Leave']
                          .map(
                            (value) => DropdownMenuItem(
                              value: value,
                              child: Text(value),
                            ),
                          )
                          .toList(),
                      onChanged: (value) =>
                          setDialogState(() => status = value ?? 'Active'),
                    ),
                    if (row == null)
                      const Padding(
                        padding: EdgeInsets.only(top: 12),
                        child: Text(
                          'A secure access code will be generated and displayed once after saving.',
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  Navigator.pop(dialogContext, true);
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    if (save == true) {
      final variables = <String, dynamic>{
        if (row != null) 'id': row['id'],
        'fullName': name.text.trim(),
        'position': position.text.trim(),
        'department': department.text.trim(),
        'email': email.text.trim().toLowerCase(),
        'contact': contact.text.trim(),
        'salary': double.tryParse(salary.text),
        'role': role,
        'userRole': role,
        'startDate':
            row?['startDate'] ??
            DateTime.now().toIso8601String().split('T').first,
        'status': status,
        'attendance': row?['attendance'] ?? 0,
        'salaryPaymentStatus': row?['salaryPaymentStatus'] ?? 'Pending',
      };
      String? accessCode;
      if (row == null) {
        final suffix = AuthService.currentUser!.id.length >= 4
            ? AuthService.currentUser!.id.substring(0, 4)
            : AuthService.currentUser!.id;
        accessCode =
            'EMP-${DateTime.now().microsecondsSinceEpoch.toRadixString(36).toUpperCase()}-${suffix.toUpperCase()}';
        variables['accessCode'] = accessCode;
      }
      await _saveOperation(
        row == null ? 'CreateEmployeeWithAccess' : 'UpdateEmployeeWithAccess',
        variables,
      );
      if (accessCode != null && mounted) {
        await showDialog<void>(
          context: context,
          builder: (dialogContext) => AlertDialog(
            title: const Text('Employee access created'),
            content: SelectableText(
              'Share this code securely with ${name.text.trim()}:\n\n$accessCode\n\nIt will not be shown again.',
            ),
            actions: [
              FilledButton(
                onPressed: () => Navigator.pop(dialogContext),
                child: const Text('Done'),
              ),
            ],
          ),
        );
      }
    }
    for (final controller in [
      name,
      position,
      department,
      email,
      contact,
      salary,
    ]) {
      controller.dispose();
    }
  }

  Future<void> _customerDialog(Map<String, dynamic>? row) async {
    final name = _controller(row, 'customerName');
    final phone = _controller(row, 'phoneNumber');
    final email = _controller(row, 'email');
    final location = _controller(row, 'location');
    final notes = _controller(row, 'notes');
    final saved = await _recordDialog(
      title: row == null ? 'Add customer' : 'Edit customer',
      fields: [
        (name, 'Customer name', TextInputType.name, 1, true),
        (phone, 'Phone number', TextInputType.phone, 1, false),
        (email, 'Email', TextInputType.emailAddress, 1, false),
        (location, 'Location', TextInputType.streetAddress, 1, false),
        (notes, 'Notes', TextInputType.multiline, 3, false),
      ],
    );
    if (saved) {
      await _saveOperation(row == null ? 'CreateCustomer' : 'UpdateCustomer', {
        if (row != null) 'id': row['id'],
        'customerName': name.text.trim(),
        'phoneNumber': phone.text.trim(),
        'email': email.text.trim(),
        'location': location.text.trim(),
        'notes': notes.text.trim(),
      });
    }
    for (final controller in [name, phone, email, location, notes]) {
      controller.dispose();
    }
  }

  Future<void> _supplierDialog(Map<String, dynamic>? row) async {
    final name = _controller(row, 'supplierName');
    final phone = _controller(row, 'phoneNumber');
    final email = _controller(row, 'email');
    final location = _controller(row, 'location');
    final products = _controller(row, 'productsSupplied');
    final payment = _controller(row, 'paymentStatus');
    final notes = _controller(row, 'notes');
    final saved = await _recordDialog(
      title: row == null ? 'Add supplier' : 'Edit supplier',
      fields: [
        (name, 'Supplier name', TextInputType.name, 1, true),
        (phone, 'Phone number', TextInputType.phone, 1, false),
        (email, 'Email', TextInputType.emailAddress, 1, false),
        (location, 'Location', TextInputType.streetAddress, 1, false),
        (products, 'Products supplied', TextInputType.text, 2, false),
        (payment, 'Payment status', TextInputType.text, 1, false),
        (notes, 'Notes', TextInputType.multiline, 3, false),
      ],
    );
    if (saved) {
      await _saveOperation(row == null ? 'CreateSupplier' : 'UpdateSupplier', {
        if (row != null) 'id': row['id'],
        'supplierName': name.text.trim(),
        'phoneNumber': phone.text.trim(),
        'email': email.text.trim(),
        'location': location.text.trim(),
        'productsSupplied': products.text.trim(),
        'paymentStatus': payment.text.trim(),
        'notes': notes.text.trim(),
      });
    }
    for (final controller in [
      name,
      phone,
      email,
      location,
      products,
      payment,
      notes,
    ]) {
      controller.dispose();
    }
  }

  Future<bool> _recordDialog({
    required String title,
    required List<(TextEditingController, String, TextInputType, int, bool)>
    fields,
  }) async {
    final formKey = GlobalKey<FormState>();
    return await showDialog<bool>(
          context: context,
          builder: (dialogContext) => AlertDialog(
            title: Text(title),
            content: SizedBox(
              width: 520,
              child: SingleChildScrollView(
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      for (final field in fields) ...[
                        TextFormField(
                          controller: field.$1,
                          keyboardType: field.$3,
                          maxLines: field.$4,
                          decoration: InputDecoration(labelText: field.$2),
                          validator: field.$5 ? _required : null,
                        ),
                        const SizedBox(height: 10),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () {
                  if (formKey.currentState!.validate()) {
                    Navigator.pop(dialogContext, true);
                  }
                },
                child: const Text('Save'),
              ),
            ],
          ),
        ) ??
        false;
  }

  String? _required(String? value) =>
      value == null || value.trim().isEmpty ? 'Required' : null;

  Future<void> _saveOperation(
    String operation,
    Map<String, dynamic> variables,
  ) async {
    try {
      await DataApi.operation(operation, variables);
      await _load();
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _delete(Map<String, dynamic> row) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete record?'),
        content: const Text('This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    final operation = switch (widget.module) {
      BusinessModule.employees =>
        (row['email']?.toString().isNotEmpty ?? false)
            ? 'DeleteEmployeeWithAccess'
            : 'DeleteEmployee',
      BusinessModule.customers => 'DeleteCustomer',
      BusinessModule.suppliers => 'DeleteSupplier',
      _ => '',
    };
    await _saveOperation(operation, {'id': row['id']});
  }

  void _message(String message, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: error ? Colors.red : null,
      ),
    );
  }

  String _name(Map<String, dynamic> row) => switch (widget.module) {
    BusinessModule.employees => row['fullName']?.toString() ?? 'Employee',
    BusinessModule.customers => row['customerName']?.toString() ?? 'Customer',
    BusinessModule.suppliers => row['supplierName']?.toString() ?? 'Supplier',
    _ => 'Record',
  };
  String _subtitle(Map<String, dynamic> row) => switch (widget.module) {
    BusinessModule.employees =>
      '${row['position'] ?? 'Staff'} • ${row['department'] ?? 'General'}\n${row['email'] ?? 'No login email'} • ${row['status'] ?? 'Active'}',
    BusinessModule.customers =>
      '${row['phoneNumber'] ?? 'No phone'} • ${row['location'] ?? 'No location'}\n${row['totalOrders'] ?? 0} orders • FCFA ${row['totalSpent'] ?? 0}',
    BusinessModule.suppliers =>
      '${row['phoneNumber'] ?? 'No phone'} • ${row['email'] ?? 'No email'}\n${row['productsSupplied'] ?? 'Products not specified'}',
    _ => '',
  };

  @override
  Widget build(BuildContext context) {
    final filtered = _rows
        .where((row) => row.values.join(' ').toLowerCase().contains(_query))
        .toList();
    return Scaffold(
      appBar: AppBar(
        title: Text(_title),
        actions: [
          IconButton(onPressed: _load, icon: const Icon(Icons.refresh)),
        ],
      ),
      drawer: AppDrawer(currentRoute: '/${widget.module.name}'),
      floatingActionButton: _canManage
          ? FloatingActionButton.extended(
              onPressed: () => _edit(null),
              icon: const Icon(Icons.add),
              label: Text(
                'Add ${_title.substring(0, _title.length - 1).toLowerCase()}',
              ),
            )
          : null,
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            TextField(
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search',
              ),
              onChanged: (value) =>
                  setState(() => _query = value.trim().toLowerCase()),
            ),
            const SizedBox(height: 14),
            if (_loading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: CircularProgressIndicator(),
                ),
              )
            else if (_error != null)
              Center(child: Text(_error!))
            else if (filtered.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Text('No ${_title.toLowerCase()} found.'),
                ),
              )
            else
              ...filtered.map(
                (row) => Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Icon(
                        widget.module == BusinessModule.employees
                            ? Icons.badge_outlined
                            : widget.module == BusinessModule.customers
                            ? Icons.person_outline
                            : Icons.local_shipping_outlined,
                      ),
                    ),
                    title: Text(
                      _name(row),
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(_subtitle(row)),
                    isThreeLine: true,
                    trailing: _canManage
                        ? PopupMenuButton<String>(
                            onSelected: (value) =>
                                value == 'edit' ? _edit(row) : _delete(row),
                            itemBuilder: (_) => const [
                              PopupMenuItem(value: 'edit', child: Text('Edit')),
                              PopupMenuItem(
                                value: 'delete',
                                child: Text('Delete'),
                              ),
                            ],
                          )
                        : null,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
