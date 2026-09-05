import 'package:flutter/material.dart';

import '../services/platform_api.dart';
import '../services/api_config.dart';
import '../widgets/app_drawer.dart';
import '../widgets/metric_grid.dart';
import 'package:intl/intl.dart';

class PlatformAdminScreen extends StatefulWidget {
  final int initialTab;

  const PlatformAdminScreen({super.key, this.initialTab = 0});

  @override
  State<PlatformAdminScreen> createState() => _PlatformAdminScreenState();
}

class _PlatformAdminScreenState extends State<PlatformAdminScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs;
  Map<String, dynamic> _overview = const {};
  List<Map<String, dynamic>> _users = const [];
  List<Map<String, dynamic>> _businessOptions = const [];
  String _userQuery = '';
  int _userPage = 1;
  int _userTotal = 0;
  static const int _userPageSize = 100;
  bool _loading = true;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(
      length: 4,
      vsync: this,
      initialIndex: widget.initialTab,
    );
    _load();
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _rows(String key) =>
      (_overview[key] as List<dynamic>? ?? const [])
          .cast<Map<String, dynamic>>();

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        PlatformApi.operation('overview', {'pageSize': 50}),
        PlatformApi.operation('users.list', {
          'page': _userPage,
          'pageSize': _userPageSize,
          if (_userQuery.isNotEmpty) 'search': _userQuery,
        }),
      ]);
      if (mounted) {
        setState(() {
          _overview = results[0];
          _users = (results[1]['users'] as List<dynamic>? ?? const [])
              .cast<Map<String, dynamic>>();
          _businessOptions =
              (results[1]['businessOptions'] as List<dynamic>? ?? const [])
                  .cast<Map<String, dynamic>>();
          _userTotal = (results[1]['total'] as num?)?.toInt() ?? _users.length;
          _userPage = (results[1]['page'] as num?)?.toInt() ?? _userPage;
        });
      }
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _act(
    String action,
    Map<String, dynamic> input,
    String message,
  ) async {
    setState(() => _saving = true);
    try {
      await PlatformApi.operation(action, input);
      await _load();
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(message)));
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

  Future<Map<String, dynamic>?> _actWithResult(
    String action,
    Map<String, dynamic> input,
  ) async {
    setState(() => _saving = true);
    try {
      final result = await PlatformApi.operation(action, input);
      await _load();
      return result;
    } catch (error) {
      _message(error.toString(), error: true);
      return null;
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _showInvitation(Map<String, dynamic> result) async {
    final token = result['invitationToken']?.toString();
    if (token == null || !mounted) return;
    final email =
        result['email']?.toString() ?? result['ownerEmail']?.toString() ?? '';
    final link =
        '${ApiConfig.baseUrl}/register?invite=${Uri.encodeQueryComponent(token)}&email=${Uri.encodeQueryComponent(email)}';
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Invitation created'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Share this private registration link securely. It is shown only now.',
            ),
            const SizedBox(height: 12),
            SelectableText(link),
            const SizedBox(height: 10),
            Text('Expires: ${result['invitationExpiresAt'] ?? 'in 7 days'}'),
          ],
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

  Future<void> _createTenant() async {
    final name = TextEditingController();
    final sector = TextEditingController();
    final location = TextEditingController();
    final ownerName = TextEditingController();
    final ownerEmail = TextEditingController();
    var plan = 'Basic';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create workspace'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: name,
                  decoration: const InputDecoration(labelText: 'Business name'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: sector,
                  decoration: const InputDecoration(labelText: 'Sector'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: location,
                  decoration: const InputDecoration(labelText: 'Location'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: ownerName,
                  decoration: const InputDecoration(labelText: 'Owner name'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: ownerEmail,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Owner email'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: plan,
                  decoration: const InputDecoration(labelText: 'Plan'),
                  items: ['Basic', 'Premium', 'Enterprise']
                      .map(
                        (value) =>
                            DropdownMenuItem(value: value, child: Text(value)),
                      )
                      .toList(),
                  onChanged: (value) =>
                      setDialogState(() => plan = value ?? 'Basic'),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      final result = await _actWithResult('tenant.create', {
        'name': name.text.trim(),
        'businessSector': sector.text.trim(),
        'location': location.text.trim(),
        'ownerName': ownerName.text.trim(),
        'ownerEmail': ownerEmail.text.trim(),
        'plan': plan,
      });
      if (result != null) await _showInvitation(result);
    }
    for (final controller in [name, sector, location, ownerName, ownerEmail]) {
      controller.dispose();
    }
  }

  Future<void> _announce() async {
    final title = TextEditingController();
    final message = TextEditingController();
    var priority = 'NORMAL';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Platform announcement'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: title,
                decoration: const InputDecoration(labelText: 'Title'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: message,
                maxLines: 4,
                decoration: const InputDecoration(labelText: 'Message'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: priority,
                items: ['NORMAL', 'IMPORTANT', 'URGENT']
                    .map(
                      (value) =>
                          DropdownMenuItem(value: value, child: Text(value)),
                    )
                    .toList(),
                onChanged: (value) =>
                    setDialogState(() => priority = value ?? 'NORMAL'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Publish'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _act(
        'announcement.publish',
        {
          'tenantId': null,
          'title': title.text.trim(),
          'message': message.text.trim(),
          'priority': priority,
        },
        'Announcement published to all active workspaces.',
      );
    }
    title.dispose();
    message.dispose();
  }

  Future<void> _inviteUser() async {
    final tenants = _rows('tenantOptions');
    final businesses = _businessOptions;
    if (tenants.isEmpty || businesses.isEmpty) {
      _message('Create a workspace before inviting users.', error: true);
      return;
    }
    final name = TextEditingController();
    final email = TextEditingController();
    final department = TextEditingController();
    final phone = TextEditingController();
    var tenantId = tenants.first['id'].toString();
    var matching = businesses
        .where((item) => item['tenantId']?.toString() == tenantId)
        .toList();
    var businessId = matching.isEmpty
        ? businesses.first['id'].toString()
        : matching.first['id'].toString();
    var role = 'Staff';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Invite platform user'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: name,
                    decoration: const InputDecoration(labelText: 'Full name'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: email,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: tenantId,
                    decoration: const InputDecoration(labelText: 'Workspace'),
                    items: tenants
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text(item['name'].toString()),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => setDialogState(() {
                      tenantId = value ?? tenantId;
                      matching = businesses
                          .where(
                            (item) => item['tenantId']?.toString() == tenantId,
                          )
                          .toList();
                      if (matching.isNotEmpty) {
                        businessId = matching.first['id'].toString();
                      }
                    }),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    key: ValueKey(tenantId),
                    initialValue:
                        matching.any(
                          (item) => item['id'].toString() == businessId,
                        )
                        ? businessId
                        : null,
                    decoration: const InputDecoration(labelText: 'Business'),
                    items: matching
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text(item['name'].toString()),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => businessId = value ?? businessId,
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: role,
                    decoration: const InputDecoration(labelText: 'Role'),
                    items:
                        [
                              'Manager',
                              'Accountant',
                              'HR Officer',
                              'Staff',
                              'Viewer',
                            ]
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
                  TextField(
                    controller: department,
                    decoration: const InputDecoration(labelText: 'Department'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: phone,
                    decoration: const InputDecoration(labelText: 'Phone'),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Invite'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      final result = await _actWithResult('user.invite', {
        'tenantId': tenantId,
        'businessId': businessId,
        'email': email.text.trim(),
        'fullName': name.text.trim(),
        'role': role,
        'department': department.text.trim(),
        'phoneNumber': phone.text.trim(),
      });
      if (result != null) await _showInvitation(result);
    }
    for (final controller in [name, email, department, phone]) {
      controller.dispose();
    }
  }

  Future<void> _editUser(Map<String, dynamic> user) async {
    final name = TextEditingController(text: user['fullName']?.toString());
    final email = TextEditingController(text: user['email']?.toString());
    final department = TextEditingController(
      text: user['department']?.toString(),
    );
    final phone = TextEditingController(text: user['phoneNumber']?.toString());
    var role = user['role']?.toString() ?? 'Viewer';
    var status = user['status']?.toString() ?? 'Active';
    final businesses = _businessOptions
        .where((item) => item['tenantId'] == user['tenantId'])
        .toList();
    var businessId = user['businessId']?.toString() ?? '';
    if (!businesses.any((item) => item['id'].toString() == businessId) &&
        businesses.isNotEmpty) {
      businessId = businesses.first['id'].toString();
    }
    final authLinked = user['authLinked'] == true;
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Edit platform user'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: name,
                    decoration: const InputDecoration(labelText: 'Full name'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: email,
                    enabled: !authLinked,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  if (authLinked)
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Padding(
                        padding: EdgeInsets.only(top: 4),
                        child: Text(
                          'Email is managed by the linked authentication account.',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ),
                    ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: department,
                    decoration: const InputDecoration(labelText: 'Department'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: phone,
                    decoration: const InputDecoration(labelText: 'Phone'),
                  ),
                  if (businesses.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      initialValue: businessId,
                      decoration: const InputDecoration(labelText: 'Business'),
                      items: businesses
                          .map(
                            (value) => DropdownMenuItem(
                              value: value['id'].toString(),
                              child: Text(value['name'].toString()),
                            ),
                          )
                          .toList(),
                      onChanged: (value) => businessId = value ?? businessId,
                    ),
                  ],
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: role,
                    decoration: const InputDecoration(labelText: 'Role'),
                    items:
                        [
                              'Platform Super Admin',
                              if (authLinked || role == 'Business Owner')
                                'Business Owner',
                              'Manager',
                              'Accountant',
                              'HR Officer',
                              'Staff',
                              'Viewer',
                            ]
                            .map(
                              (value) => DropdownMenuItem(
                                value: value,
                                child: Text(value),
                              ),
                            )
                            .toList(),
                    onChanged: (value) =>
                        setDialogState(() => role = value ?? role),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: status,
                    decoration: const InputDecoration(labelText: 'Status'),
                    items: ['Active', 'Suspended']
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) =>
                        setDialogState(() => status = value ?? status),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      if (role == 'Business Owner' && user['role'] != 'Business Owner') {
        if (!mounted) {
          for (final controller in [name, email, department, phone]) {
            controller.dispose();
          }
          return;
        }
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (dialogContext) => AlertDialog(
            title: const Text('Transfer workspace ownership?'),
            content: Text(
              '${name.text.trim()} will become the owner of ${user['tenantName']}. '
              'The current owner will become a Manager.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(dialogContext, true),
                child: const Text('Transfer ownership'),
              ),
            ],
          ),
        );
        if (confirmed != true) {
          for (final controller in [name, email, department, phone]) {
            controller.dispose();
          }
          return;
        }
      }
      await _act('user.update', {
        'id': user['id'],
        'fullName': name.text.trim(),
        'email': email.text.trim(),
        'department': department.text.trim(),
        'phoneNumber': phone.text.trim(),
        if (businessId.isNotEmpty) 'businessId': businessId,
        'role': role,
        'status': status,
      }, 'User updated.');
    }
    for (final controller in [name, email, department, phone]) {
      controller.dispose();
    }
  }

  Future<void> _renewInvitation(Map<String, dynamic> user) async {
    final result = await _actWithResult('user.invite.renew', {
      'id': user['id'],
    });
    if (result != null) await _showInvitation(result);
  }

  Future<void> _userDetails(Map<String, dynamic> user) async {
    try {
      final data = await PlatformApi.operation('user.details', {
        'id': user['id'],
      });
      if (!mounted) return;
      final sessions = (data['sessions'] as List<dynamic>? ?? const []);
      final activity = (data['activity'] as List<dynamic>? ?? const []);
      final audit = (data['audit'] as List<dynamic>? ?? const []);
      await showDialog<void>(
        context: context,
        builder: (dialogContext) => AlertDialog(
          title: Text(user['fullName']?.toString() ?? 'User details'),
          content: SizedBox(
            width: 560,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${user['email']}\n${user['role']} • ${user['tenantName']}',
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Sessions (${sessions.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...sessions.take(5).map((item) {
                    final row = item as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(
                        row['revokedAt'] == null
                            ? 'Active session'
                            : 'Revoked session',
                      ),
                      subtitle: Text(
                        'Last used: ${row['lastUsedAt'] ?? 'Unknown'}',
                      ),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Recent activity (${activity.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...activity.take(8).map((item) {
                    final row = item as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(row['actionType']?.toString() ?? 'Activity'),
                      subtitle: Text(row['description']?.toString() ?? ''),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Administrative audit (${audit.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...audit.take(8).map((item) {
                    final row = item as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(row['action']?.toString() ?? 'Admin action'),
                      subtitle: Text(
                        '${row['actorEmail'] ?? ''} • ${row['createdAt'] ?? ''}',
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
          actions: [
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _tenantDetails(Map<String, dynamic> tenant) async {
    try {
      final data = await PlatformApi.operation('tenant.details', {
        'id': tenant['id'],
      });
      if (!mounted) return;
      final users = (data['users'] as List<dynamic>? ?? const []);
      final businesses = (data['businesses'] as List<dynamic>? ?? const []);
      final notes = (data['notes'] as List<dynamic>? ?? const []);
      final invoices = (data['invoices'] as List<dynamic>? ?? const []);
      final support = (data['supportCases'] as List<dynamic>? ?? const []);
      final audit = (data['audit'] as List<dynamic>? ?? const []);
      await showDialog<void>(
        context: context,
        builder: (dialogContext) => AlertDialog(
          title: Text(tenant['name']?.toString() ?? 'Workspace'),
          content: SizedBox(
            width: 580,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${tenant['plan']} • ${tenant['status']}\n${tenant['ownerEmail']}\n${tenant['location']}',
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Businesses (${businesses.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...businesses.take(10).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.business_outlined),
                      title: Text(row['name']?.toString() ?? 'Business'),
                      subtitle: Text(row['location']?.toString() ?? ''),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Users (${users.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...users.take(10).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.person_outline),
                      title: Text(
                        row['fullName']?.toString() ??
                            row['email']?.toString() ??
                            'User',
                      ),
                      subtitle: Text('${row['role']} • ${row['status']}'),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Notes (${notes.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...notes.take(10).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(row['body']?.toString() ?? ''),
                      subtitle: Text(
                        '${row['createdByEmail'] ?? ''} • ${row['createdAt'] ?? ''}',
                      ),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Invoices (${invoices.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...invoices.take(8).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.receipt_long_outlined),
                      title: Text(
                        row['invoiceNumber']?.toString() ?? 'Invoice',
                      ),
                      subtitle: Text(
                        '${row['status']} • ${row['amountDueFcfa'] ?? 0} FCFA',
                      ),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Support cases (${support.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...support.take(8).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.support_agent_outlined),
                      title: Text(row['subject']?.toString() ?? 'Support case'),
                      subtitle: Text('${row['priority']} • ${row['status']}'),
                    );
                  }),
                  const SizedBox(height: 10),
                  Text(
                    'Admin audit (${audit.length})',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  ...audit.take(8).map((raw) {
                    final row = raw as Map<String, dynamic>;
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.policy_outlined),
                      title: Text(row['action']?.toString() ?? 'Admin action'),
                      subtitle: Text(row['actorEmail']?.toString() ?? ''),
                    );
                  }),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                _addTenantNote(tenant);
              },
              child: const Text('Add note'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _editTenant(Map<String, dynamic> tenant) async {
    final name = TextEditingController(text: tenant['name']?.toString());
    final sector = TextEditingController(
      text: tenant['businessSector']?.toString(),
    );
    final location = TextEditingController(
      text: tenant['location']?.toString(),
    );
    final ownerEmail = TextEditingController(
      text: tenant['ownerEmail']?.toString(),
    );
    var interval = tenant['billingInterval']?.toString() ?? 'monthly';
    var cancelAtEnd = tenant['cancelAtPeriodEnd'] == true;
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Edit workspace'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: name,
                    decoration: const InputDecoration(labelText: 'Name'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: sector,
                    decoration: const InputDecoration(labelText: 'Sector'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: location,
                    decoration: const InputDecoration(labelText: 'Location'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: ownerEmail,
                    decoration: const InputDecoration(labelText: 'Owner email'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: interval,
                    decoration: const InputDecoration(
                      labelText: 'Billing interval',
                    ),
                    items: ['monthly', 'annual']
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) =>
                        setDialogState(() => interval = value ?? interval),
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Cancel subscription at period end'),
                    value: cancelAtEnd,
                    onChanged: (value) =>
                        setDialogState(() => cancelAtEnd = value),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _act('tenant.update', {
        'id': tenant['id'],
        'name': name.text.trim(),
        'businessSector': sector.text.trim(),
        'location': location.text.trim(),
        'ownerEmail': ownerEmail.text.trim(),
        'billingInterval': interval,
        'cancelAtPeriodEnd': cancelAtEnd,
      }, 'Workspace updated.');
    }
    for (final controller in [name, sector, location, ownerEmail]) {
      controller.dispose();
    }
  }

  Future<void> _addTenantNote(Map<String, dynamic> tenant) async {
    final body = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Internal workspace note'),
        content: TextField(
          controller: body,
          maxLines: 4,
          decoration: const InputDecoration(labelText: 'Note'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Add note'),
          ),
        ],
      ),
    );
    if (submit == true && body.text.trim().isNotEmpty) {
      await _act('tenant.note', {
        'tenantId': tenant['id'],
        'body': body.text.trim(),
      }, 'Workspace note added.');
    }
    body.dispose();
  }

  Future<void> _createInvoice() async {
    final tenants = _rows('tenantOptions');
    if (tenants.isEmpty) return;
    var tenantId = tenants.first['id'].toString();
    final amount = TextEditingController();
    final description = TextEditingController();
    DateTime? dueDate = DateTime.now().add(const Duration(days: 14));
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create invoice'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: tenantId,
                decoration: const InputDecoration(labelText: 'Workspace'),
                items: tenants
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['id'].toString(),
                        child: Text(item['name'].toString()),
                      ),
                    )
                    .toList(),
                onChanged: (value) => tenantId = value ?? tenantId,
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amount,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Amount (FCFA)'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: description,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Due date'),
                subtitle: Text(dueDate?.toString().split(' ').first ?? 'None'),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 1095)),
                    initialDate: dueDate ?? DateTime.now(),
                  );
                  if (value != null) setDialogState(() => dueDate = value);
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _act('invoice.create', {
        'tenantId': tenantId,
        'amountFcfa': int.tryParse(amount.text) ?? 0,
        'dueAt': dueDate?.toUtc().toIso8601String(),
        'description': description.text.trim(),
      }, 'Invoice created.');
    }
    amount.dispose();
    description.dispose();
  }

  Future<void> _invoiceAction(
    Map<String, dynamic> invoice,
    String action,
  ) async {
    if (action == 'void') {
      await _act('invoice.void', {
        'invoiceId': invoice['id'],
      }, 'Invoice voided.');
      return;
    }
    final amount = TextEditingController(
      text: invoice['amountDueFcfa']?.toString(),
    );
    final method = TextEditingController(text: 'Bank transfer');
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Record invoice payment'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amount,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Amount (FCFA)'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: method,
              decoration: const InputDecoration(labelText: 'Payment method'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Record'),
          ),
        ],
      ),
    );
    if (submit == true) {
      await _act('invoice.pay', {
        'invoiceId': invoice['id'],
        'amountFcfa': int.tryParse(amount.text),
        'method': method.text.trim(),
      }, 'Payment recorded.');
    }
    amount.dispose();
    method.dispose();
  }

  Future<void> _createSupport() async {
    final tenants = _rows('tenantOptions');
    if (tenants.isEmpty) return;
    var tenantId = tenants.first['id'].toString();
    var priority = 'normal';
    final subject = TextEditingController();
    final description = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create support case'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: tenantId,
                decoration: const InputDecoration(labelText: 'Workspace'),
                items: tenants
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['id'].toString(),
                        child: Text(item['name'].toString()),
                      ),
                    )
                    .toList(),
                onChanged: (value) => tenantId = value ?? tenantId,
              ),
              const SizedBox(height: 10),
              TextField(
                controller: subject,
                decoration: const InputDecoration(labelText: 'Subject'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: description,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: priority,
                decoration: const InputDecoration(labelText: 'Priority'),
                items: ['low', 'normal', 'high', 'urgent']
                    .map(
                      (value) =>
                          DropdownMenuItem(value: value, child: Text(value)),
                    )
                    .toList(),
                onChanged: (value) =>
                    setDialogState(() => priority = value ?? priority),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _act('support.create', {
        'tenantId': tenantId,
        'subject': subject.text.trim(),
        'description': description.text.trim(),
        'priority': priority,
      }, 'Support case created.');
    }
    subject.dispose();
    description.dispose();
  }

  Future<void> _editPlan(Map<String, dynamic> plan) async {
    TextEditingController field(String key) =>
        TextEditingController(text: plan[key]?.toString() ?? '');
    final monthly = field('monthlyPriceFcfa');
    final annual = field('annualPriceFcfa');
    final users = field('maxUsers');
    final businesses = field('maxBusinesses');
    final documents = field('maxDocuments');
    final ai = field('monthlyAiRequests');
    int? nullableInt(TextEditingController controller) =>
        controller.text.trim().isEmpty ? null : int.tryParse(controller.text);
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text('Edit ${plan['displayName'] ?? plan['code']}'),
        content: SizedBox(
          width: 520,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: monthly,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Monthly price (FCFA)',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: annual,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Annual price (FCFA)',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: users,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Maximum users',
                    helperText: 'Leave blank for unlimited',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: businesses,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Maximum businesses',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: documents,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Maximum documents',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: ai,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Monthly AI requests',
                  ),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (submit == true) {
      await _act('plan.update', {
        'code': plan['code'],
        'monthlyPriceFcfa': int.tryParse(monthly.text) ?? 0,
        'annualPriceFcfa': int.tryParse(annual.text) ?? 0,
        'maxUsers': nullableInt(users),
        'maxBusinesses': nullableInt(businesses),
        'maxDocuments': nullableInt(documents),
        'monthlyAiRequests': nullableInt(ai),
      }, 'Plan limits and pricing updated.');
    }
    for (final controller in [
      monthly,
      annual,
      users,
      businesses,
      documents,
      ai,
    ]) {
      controller.dispose();
    }
  }

  void _message(String text, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), backgroundColor: error ? Colors.red : null),
    );
  }

  @override
  Widget build(BuildContext context) {
    final totals = _overview['totals'] as Map<String, dynamic>? ?? const {};
    return Scaffold(
      appBar: AppBar(
        title: const Text('Platform administration'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _load,
            tooltip: 'Refresh platform data',
            icon: const Icon(Icons.refresh),
          ),
        ],
        bottom: TabBar(
          controller: _tabs,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Workspaces'),
            Tab(text: 'Users'),
            Tab(text: 'Billing & support'),
          ],
        ),
      ),
      drawer: AppDrawer(
        currentRoute: widget.initialTab == 2
            ? '/admin/users'
            : '/admin/dashboard',
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Platform data could not load',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(_error!, textAlign: TextAlign.center),
                    const SizedBox(height: 20),
                    OutlinedButton.icon(
                      onPressed: _load,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Try again'),
                    ),
                  ],
                ),
              ),
            )
          : TabBarView(
              controller: _tabs,
              children: [
                _overviewTab(totals),
                _tenantTab(),
                _userTab(),
                _billingTab(),
              ],
            ),
    );
  }

  String _amount(dynamic value) =>
      '${NumberFormat.decimalPattern('en').format((value is num ? value : num.tryParse('$value')) ?? 0)} FCFA';

  Widget _overviewTab(Map<String, dynamic> totals) => LayoutBuilder(
    builder: (context, constraints) => ListView(
      padding: EdgeInsets.symmetric(
        horizontal: constraints.maxWidth > 1040
            ? (constraints.maxWidth - 1000) / 2
            : 20,
        vertical: 24,
      ),
      children: [
        Text(
          'Platform overview',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: 8),
        Text(
          'Workspaces, revenue and requests that need attention.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 24),
        MetricGrid(
          metrics: [
            WorkspaceMetric(
              label: 'Workspaces',
              value: '${totals['tenants'] ?? 0}',
            ),
            WorkspaceMetric(
              label: 'Registered users',
              value: '${totals['users'] ?? 0}',
            ),
            WorkspaceMetric(
              label: 'Monthly recurring revenue',
              value: _amount(totals['mrrFcfa']),
            ),
            WorkspaceMetric(
              label: 'Outstanding balance',
              value: _amount(totals['outstandingFcfa']),
            ),
            WorkspaceMetric(
              label: 'Documents',
              value: '${totals['documents'] ?? 0}',
            ),
            WorkspaceMetric(
              label: 'Open support cases',
              value: '${totals['openSupportCases'] ?? 0}',
            ),
          ],
        ),
        const SizedBox(height: 32),
        Text(
          'Workspace operations',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            FilledButton.icon(
              onPressed: _saving ? null : _createTenant,
              icon: const Icon(Icons.add),
              label: const Text('Create workspace'),
            ),
            OutlinedButton.icon(
              onPressed: _saving ? null : _announce,
              icon: const Icon(Icons.campaign_outlined),
              label: const Text('Publish announcement'),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _tenantTab() => ListView(
    padding: const EdgeInsets.all(14),
    children: _rows('tenants').map((tenant) {
      final active = tenant['status'] == 'Active';
      return Card(
        child: ListTile(
          title: Text(tenant['name']?.toString() ?? 'Workspace'),
          subtitle: Text(
            '${tenant['plan']} • ${tenant['status']} • ${tenant['userCount']} users\n${tenant['ownerEmail']}',
          ),
          isThreeLine: true,
          onTap: () => _tenantDetails(tenant),
          trailing: PopupMenuButton<String>(
            enabled: !_saving,
            onSelected: (value) {
              if (value == 'edit') {
                _editTenant(tenant);
              } else if (value == 'note') {
                _addTenantNote(tenant);
              } else if (value == 'archive') {
                _act('tenant.update', {
                  'id': tenant['id'],
                  'lifecycle': 'archive',
                }, 'Workspace archived.');
              } else if (value == 'restore') {
                _act('tenant.update', {
                  'id': tenant['id'],
                  'lifecycle': 'restore',
                }, 'Workspace restored.');
              } else if (value == 'toggle') {
                _act(
                  'tenant.update',
                  {
                    'id': tenant['id'],
                    'status': active ? 'Suspended' : 'Active',
                    if (active)
                      'suspensionReason': 'Suspended by platform administrator',
                  },
                  active ? 'Workspace suspended.' : 'Workspace reactivated.',
                );
              } else {
                _act('tenant.update', {
                  'id': tenant['id'],
                  'plan': value,
                }, 'Subscription plan updated.');
              }
            },
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'edit', child: Text('Edit workspace')),
              const PopupMenuItem(
                value: 'note',
                child: Text('Add internal note'),
              ),
              if (tenant['status'] != 'Archived')
                PopupMenuItem(
                  value: 'toggle',
                  child: Text(active ? 'Suspend' : 'Reactivate'),
                ),
              if (tenant['status'] == 'Archived')
                const PopupMenuItem(
                  value: 'restore',
                  child: Text('Restore workspace'),
                ),
              if (tenant['status'] != 'Archived')
                const PopupMenuItem(
                  value: 'archive',
                  child: Text('Archive workspace'),
                ),
              ...['Basic', 'Premium', 'Enterprise']
                  .where((plan) => plan != tenant['plan'])
                  .map(
                    (plan) => PopupMenuItem(
                      value: plan,
                      child: Text('Move to $plan'),
                    ),
                  ),
            ],
          ),
        ),
      );
    }).toList(),
  );

  Widget _userTab() {
    final users = _users
        .where(
          (user) => user.values.join(' ').toLowerCase().contains(_userQuery),
        )
        .toList();
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search),
                  hintText: 'Search all platform users',
                  suffixIcon: IconButton(
                    tooltip: 'Search platform',
                    onPressed: _loading
                        ? null
                        : () {
                            setState(() => _userPage = 1);
                            _load();
                          },
                    icon: const Icon(Icons.arrow_forward),
                  ),
                ),
                onChanged: (value) =>
                    setState(() => _userQuery = value.trim().toLowerCase()),
                onSubmitted: (_) {
                  setState(() => _userPage = 1);
                  _load();
                },
              ),
            ),
            const SizedBox(width: 10),
            FilledButton.icon(
              onPressed: _saving ? null : _inviteUser,
              icon: const Icon(Icons.person_add_alt_1),
              label: const Text('Invite'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ...users.map((user) {
          final active = user['status'] == 'Active';
          return Card(
            child: ListTile(
              title: Text(
                user['fullName']?.toString() ??
                    user['email']?.toString() ??
                    'User',
              ),
              subtitle: Text(
                '${user['role']} • ${user['tenantName']}\n${user['email']}',
              ),
              isThreeLine: true,
              onTap: () => _userDetails(user),
              trailing: PopupMenuButton<String>(
                enabled: !_saving,
                onSelected: (value) {
                  if (value == 'edit') {
                    _editUser(user);
                  } else if (value == 'sessions') {
                    _act('user.sessions.revoke', {
                      'id': user['id'],
                    }, 'All user sessions revoked.');
                  } else if (value == 'renew') {
                    _renewInvitation(user);
                  } else if (value == 'revoke') {
                    _act('user.invite.revoke', {
                      'id': user['id'],
                    }, 'Invitation revoked.');
                  } else {
                    _act(
                      'user.update',
                      {
                        'id': user['id'],
                        'status': active ? 'Suspended' : 'Active',
                      },
                      active ? 'User suspended.' : 'User reactivated.',
                    );
                  }
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(value: 'edit', child: Text('Edit user')),
                  PopupMenuItem(
                    value: 'toggle',
                    child: Text(
                      active ? 'Suspend account' : 'Reactivate account',
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'sessions',
                    child: Text('Revoke sessions'),
                  ),
                  if (user['invitationStatus'] == 'pending')
                    const PopupMenuItem(
                      value: 'renew',
                      child: Text('Renew invitation'),
                    ),
                  if (user['invitationStatus'] == 'pending')
                    const PopupMenuItem(
                      value: 'revoke',
                      child: Text('Revoke invitation'),
                    ),
                ],
              ),
            ),
          );
        }),
        if (_userTotal > _userPageSize) ...[
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                tooltip: 'Previous page',
                onPressed: _loading || _userPage <= 1
                    ? null
                    : () {
                        setState(() => _userPage -= 1);
                        _load();
                      },
                icon: const Icon(Icons.chevron_left),
              ),
              Text('Page $_userPage of ${(_userTotal / _userPageSize).ceil()}'),
              IconButton(
                tooltip: 'Next page',
                onPressed: _loading || _userPage * _userPageSize >= _userTotal
                    ? null
                    : () {
                        setState(() => _userPage += 1);
                        _load();
                      },
                icon: const Icon(Icons.chevron_right),
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _billingTab() => ListView(
    padding: const EdgeInsets.all(14),
    children: [
      Row(
        children: [
          const Expanded(
            child: Text(
              'Subscription plans',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          TextButton.icon(
            onPressed: _saving ? null : _createInvoice,
            icon: const Icon(Icons.add_card),
            label: const Text('New invoice'),
          ),
        ],
      ),
      ..._rows('plans').map(
        (plan) => Card(
          child: ListTile(
            title: Text(
              plan['displayName']?.toString() ??
                  plan['code']?.toString() ??
                  'Plan',
            ),
            subtitle: Text(
              '${plan['monthlyPriceFcfa'] ?? 0} FCFA / month • ${plan['maxUsers'] ?? 'Unlimited'} users',
            ),
            trailing: IconButton(
              onPressed: _saving ? null : () => _editPlan(plan),
              icon: const Icon(Icons.edit_outlined),
            ),
          ),
        ),
      ),
      const SizedBox(height: 18),
      const Text(
        'Invoices',
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
      ),
      ..._rows('invoices').map(
        (invoice) => Card(
          child: ListTile(
            title: Text(invoice['invoiceNumber']?.toString() ?? 'Invoice'),
            subtitle: Text('${invoice['tenantName']} • ${invoice['status']}'),
            trailing: PopupMenuButton<String>(
              enabled:
                  !_saving && !['paid', 'void'].contains(invoice['status']),
              onSelected: (value) => _invoiceAction(invoice, value),
              itemBuilder: (_) => const [
                PopupMenuItem(value: 'pay', child: Text('Record payment')),
                PopupMenuItem(value: 'void', child: Text('Void invoice')),
              ],
            ),
          ),
        ),
      ),
      const SizedBox(height: 18),
      Row(
        children: [
          const Expanded(
            child: Text(
              'Support cases',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          TextButton.icon(
            onPressed: _saving ? null : _createSupport,
            icon: const Icon(Icons.add_comment_outlined),
            label: const Text('New case'),
          ),
        ],
      ),
      ..._rows('supportCases').map(
        (support) => Card(
          child: ListTile(
            title: Text(support['subject']?.toString() ?? 'Support request'),
            subtitle: Text('${support['tenantName']} • ${support['priority']}'),
            trailing: DropdownButton<String>(
              value: support['status']?.toString() ?? 'open',
              items: ['open', 'in_progress', 'resolved', 'closed']
                  .map(
                    (value) =>
                        DropdownMenuItem(value: value, child: Text(value)),
                  )
                  .toList(),
              onChanged: _saving
                  ? null
                  : (value) {
                      if (value != null) {
                        _act('support.update', {
                          'id': support['id'],
                          'status': value,
                        }, 'Support case updated.');
                      }
                    },
            ),
          ),
        ),
      ),
    ],
  );
}
