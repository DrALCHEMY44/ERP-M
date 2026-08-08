import 'package:flutter/material.dart';
import '../generated/example.dart' as dc;
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

enum BusinessModule { employees, customers, suppliers, documents, settings }

class BusinessModuleScreen extends StatefulWidget {
  final BusinessModule module;
  const BusinessModuleScreen({super.key, required this.module});

  @override
  State<BusinessModuleScreen> createState() => _BusinessModuleScreenState();
}

class _BusinessModuleScreenState extends State<BusinessModuleScreen> {
  bool _loading = true;
  String? _error;
  List<_BusinessRow> _rows = const [];
  String _query = '';

  String get _route => '/${widget.module.name}';

  String get _title => switch (widget.module) {
    BusinessModule.employees => 'Employees',
    BusinessModule.customers => 'Customers',
    BusinessModule.suppliers => 'Suppliers',
    BusinessModule.documents => 'Documents',
    BusinessModule.settings => 'Workspace settings',
  };

  IconData get _icon => switch (widget.module) {
    BusinessModule.employees => Icons.badge_outlined,
    BusinessModule.customers => Icons.people_outline,
    BusinessModule.suppliers => Icons.local_shipping_outlined,
    BusinessModule.documents => Icons.folder_outlined,
    BusinessModule.settings => Icons.tune,
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final user = AuthService.currentUser;
    if (user == null) return;
    setState(() { _loading = true; _error = null; });
    try {
      final connector = dc.ExampleConnector.instance;
      final rows = <_BusinessRow>[];
      switch (widget.module) {
        case BusinessModule.employees:
          final result = await connector.listEmployeesByBusiness(tenantId: user.tenantId, businessId: user.businessId).execute();
          for (final item in result.data.employees) {
            rows.add(_BusinessRow(item.fullName, item.position, item.department ?? 'General', Icons.badge_outlined, id: item.id));
          }
          break;
        case BusinessModule.customers:
          final result = await connector.listCustomersByBusiness(tenantId: user.tenantId, businessId: user.businessId).execute();
          for (final item in result.data.customers) {
            rows.add(_BusinessRow(item.customerName, item.phoneNumber ?? 'No phone', item.location ?? 'No location', Icons.person_outline, id: item.id, orders: item.totalOrders ?? 0, spent: item.totalSpent ?? 0));
          }
          break;
        case BusinessModule.suppliers:
          final result = await connector.listSuppliersByBusiness(tenantId: user.tenantId, businessId: user.businessId).execute();
          for (final item in result.data.suppliers) {
            rows.add(_BusinessRow(item.supplierName, item.phoneNumber ?? 'No phone', item.email ?? 'No email', Icons.local_shipping_outlined, id: item.id));
          }
          break;
        case BusinessModule.documents:
          final result = await connector.listDocumentsByBusiness(tenantId: user.tenantId, businessId: user.businessId).execute();
          for (final item in result.data.documents) {
            rows.add(_BusinessRow(item.title, item.documentType, 'Uploaded by ${item.uploadedBy}', Icons.description_outlined, id: item.id));
          }
          break;
        case BusinessModule.settings:
          rows.addAll([
            _BusinessRow('Business profile', user.businessCode ?? user.businessId, 'Company identity and workspace details', Icons.domain_outlined, route: '/business-profile'),
            const _BusinessRow('Notifications', 'Manage your alerts', 'Review unread workspace activity', Icons.notifications_outlined, route: '/notifications'),
            const _BusinessRow('Account and role', 'Profile settings', 'Review your account access', Icons.manage_accounts_outlined, route: '/profile'),
          ]);
          break;
      }
      if (mounted) setState(() => _rows = rows);
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _createRecord() async {
    final user = AuthService.currentUser;
    if (user == null || widget.module == BusinessModule.settings) return;
    final primary = TextEditingController();
    final secondary = TextEditingController();
    final tertiary = TextEditingController();
    final labels = switch (widget.module) {
      BusinessModule.employees => ('Full name', 'Position', 'Department'),
      BusinessModule.customers => ('Customer name', 'Phone number', 'Location'),
      BusinessModule.suppliers => ('Supplier name', 'Phone number', 'Email'),
      BusinessModule.documents => ('Document title', 'Document type', 'File URL'),
      BusinessModule.settings => ('', '', ''),
    };
    final shouldSave = await showDialog<bool>(context: context, builder: (dialogContext) => AlertDialog(
      title: Text('Add ${_title.toLowerCase()} record'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        TextField(controller: primary, autofocus: true, decoration: InputDecoration(labelText: labels.$1)),
        const SizedBox(height: 12),
        TextField(controller: secondary, decoration: InputDecoration(labelText: labels.$2)),
        const SizedBox(height: 12),
        TextField(controller: tertiary, decoration: InputDecoration(labelText: labels.$3)),
      ]),
      actions: [TextButton(onPressed: () => Navigator.pop(dialogContext, false), child: const Text('Cancel')), FilledButton(onPressed: () => Navigator.pop(dialogContext, true), child: const Text('Save'))],
    ));
    if (shouldSave != true || primary.text.trim().isEmpty) return;
    setState(() => _loading = true);
    try {
      final connector = dc.ExampleConnector.instance;
      switch (widget.module) {
        case BusinessModule.employees:
          await connector.createEmployee(tenantId: user.tenantId, businessId: user.businessId, fullName: primary.text.trim(), position: secondary.text.trim().isEmpty ? 'Staff' : secondary.text.trim()).department(tertiary.text.trim()).execute();
          break;
        case BusinessModule.customers:
          await connector.createCustomer(tenantId: user.tenantId, businessId: user.businessId, customerName: primary.text.trim()).phoneNumber(secondary.text.trim()).location(tertiary.text.trim()).execute();
          break;
        case BusinessModule.suppliers:
          await connector.createSupplier(tenantId: user.tenantId, businessId: user.businessId, supplierName: primary.text.trim()).phoneNumber(secondary.text.trim()).email(tertiary.text.trim()).execute();
          break;
        case BusinessModule.documents:
          await connector.createDocument(tenantId: user.tenantId, businessId: user.businessId, title: primary.text.trim(), documentType: secondary.text.trim().isEmpty ? 'Other' : secondary.text.trim(), fileUrl: tertiary.text.trim(), uploadedBy: user.name).execute();
          break;
        case BusinessModule.settings:
          break;
      }
      await _load();
    } catch (error) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Could not save record: $error')));
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _deleteRecord(_BusinessRow row) async {
    if (row.id == null) return;
    final confirmed = await showDialog<bool>(context: context, builder: (dialogContext) => AlertDialog(title: const Text('Delete record?'), content: Text('This will permanently delete “${row.title}”.'), actions: [TextButton(onPressed: () => Navigator.pop(dialogContext, false), child: const Text('Cancel')), FilledButton(onPressed: () => Navigator.pop(dialogContext, true), child: const Text('Delete'))]));
    if (confirmed != true) return;
    final connector = dc.ExampleConnector.instance;
    switch (widget.module) {
      case BusinessModule.employees: await connector.deleteEmployee(id: row.id!).execute(); break;
      case BusinessModule.customers: await connector.deleteCustomer(id: row.id!).execute(); break;
      case BusinessModule.suppliers: await connector.deleteSupplier(id: row.id!).execute(); break;
      case BusinessModule.documents: await connector.deleteDocument(id: row.id!).execute(); break;
      case BusinessModule.settings: break;
    }
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final filtered = _rows.where((row) => '${row.title} ${row.subtitle} ${row.meta}'.toLowerCase().contains(_query)).toList();
    return Scaffold(
      appBar: AppBar(
        title: Text(_title, style: const TextStyle(fontWeight: FontWeight.w800)),
        actions: [IconButton(onPressed: _load, icon: const Icon(Icons.refresh_rounded))],
      ),
      drawer: AppDrawer(currentRoute: _route),
      floatingActionButton: widget.module == BusinessModule.settings ? null : FloatingActionButton.extended(onPressed: _createRecord, icon: const Icon(Icons.add), label: const Text('Add record')),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF1E3A8A), Color(0xFF4F46E5)]),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Row(children: [
                Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white.withValues(alpha: .14), borderRadius: BorderRadius.circular(16)), child: Icon(_icon, color: Colors.white)),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(_title, style: theme.textTheme.titleLarge?.copyWith(color: Colors.white, fontWeight: FontWeight.w800)),
                  Text('${_rows.length} workspace records', style: const TextStyle(color: Color(0xFFCBD5E1))),
                ])),
              ]),
            ),
            if (widget.module == BusinessModule.customers) ...[
              const SizedBox(height: 14),
              _CustomerDashboard(rows: _rows),
            ],
            const SizedBox(height: 18),
            TextField(
              onChanged: (value) => setState(() => _query = value.trim().toLowerCase()),
              decoration: const InputDecoration(hintText: 'Search records', prefixIcon: Icon(Icons.search_rounded)),
            ),
            const SizedBox(height: 16),
            if (_loading) const Padding(padding: EdgeInsets.all(48), child: Center(child: CircularProgressIndicator()))
            else if (_error != null) _ErrorState(onRetry: _load)
            else if (filtered.isEmpty) _EmptyState(icon: _icon, title: _title)
            else ...filtered.map((row) => Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: theme.colorScheme.primary.withValues(alpha: .08), borderRadius: BorderRadius.circular(14)), child: Icon(row.icon, color: theme.colorScheme.primary)),
                title: Text(row.title, style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text('${row.subtitle}\n${row.meta}'),
                isThreeLine: true,
                trailing: row.id != null ? PopupMenuButton<String>(onSelected: (_) => _deleteRecord(row), itemBuilder: (_) => const [PopupMenuItem(value: 'delete', child: Row(children: [Icon(Icons.delete_outline), SizedBox(width: 8), Text('Delete')]))]) : const Icon(Icons.arrow_forward_rounded),
                onTap: row.route == null ? null : () => Navigator.pushNamed(context, row.route!),
              ),
            )),
          ],
        ),
      ),
    );
  }
}

class _BusinessRow {
  final String title;
  final String subtitle;
  final String meta;
  final IconData icon;
  final String? route;
  final String? id;
  final int orders;
  final double spent;
  const _BusinessRow(this.title, this.subtitle, this.meta, this.icon, {this.route, this.id, this.orders = 0, this.spent = 0});
}

class _CustomerDashboard extends StatelessWidget {
  final List<_BusinessRow> rows;
  const _CustomerDashboard({required this.rows});

  @override
  Widget build(BuildContext context) {
    final totalRevenue = rows.fold<double>(0, (sum, row) => sum + row.spent);
    final totalOrders = rows.fold<int>(0, (sum, row) => sum + row.orders);
    final repeat = rows.where((row) => row.orders > 1).length;
    final repeatRate = rows.isEmpty ? 0 : ((repeat / rows.length) * 100).round();
    final top = [...rows]..sort((a, b) => b.spent.compareTo(a.spent));

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0B1423),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Row(children: [Icon(Icons.insights_rounded, color: Color(0xFF22D3EE), size: 18), SizedBox(width: 8), Text('Customer intelligence', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800)), Spacer(), Text('LIVE', style: TextStyle(color: Color(0xFF34D399), fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1.2))]),
        const SizedBox(height: 14),
        Row(children: [
          Expanded(child: _CustomerMetric(label: 'REVENUE', value: '${(totalRevenue / 1000000).toStringAsFixed(1)}M', color: const Color(0xFF34D399))),
          const SizedBox(width: 8),
          Expanded(child: _CustomerMetric(label: 'ORDERS', value: '$totalOrders', color: const Color(0xFF22D3EE))),
          const SizedBox(width: 8),
          Expanded(child: _CustomerMetric(label: 'REPEAT', value: '$repeatRate%', color: const Color(0xFFA78BFA))),
        ]),
        const SizedBox(height: 14),
        const Text('Top relationships', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: .8)),
        const SizedBox(height: 8),
        if (top.isEmpty)
          const Padding(padding: EdgeInsets.symmetric(vertical: 10), child: Text('Sales activity will reveal your top customers.', style: TextStyle(color: Color(0xFF64748B), fontSize: 11)))
        else
          ...top.take(3).toList().asMap().entries.map((entry) => Padding(
            padding: const EdgeInsets.only(top: 7),
            child: Row(children: [
              Container(width: 25, height: 25, alignment: Alignment.center, decoration: BoxDecoration(color: const Color(0xFF22D3EE).withValues(alpha: .1), borderRadius: BorderRadius.circular(8)), child: Text('${entry.key + 1}', style: const TextStyle(color: Color(0xFF67E8F9), fontSize: 10, fontWeight: FontWeight.w800))),
              const SizedBox(width: 9),
              Expanded(child: Text(entry.value.title, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700))),
              Text('${entry.value.spent.toStringAsFixed(0)} FCFA', style: const TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.w700)),
            ]),
          )),
      ]),
    );
  }
}

class _CustomerMetric extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _CustomerMetric({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(11),
    decoration: BoxDecoration(color: Colors.white.withValues(alpha: .035), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white.withValues(alpha: .05))),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 8, fontWeight: FontWeight.w800)), const SizedBox(height: 5), Text(value, style: TextStyle(color: color, fontSize: 15, fontWeight: FontWeight.w900))]),
  );
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  const _EmptyState({required this.icon, required this.title});
  @override Widget build(BuildContext context) => Padding(padding: const EdgeInsets.symmetric(vertical: 64), child: Column(children: [Icon(icon, size: 44, color: Colors.blueGrey.shade300), const SizedBox(height: 12), Text('No $title yet', style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(height: 4), const Text('Pull down to synchronize workspace data.', style: TextStyle(color: Colors.blueGrey))]));
}

class _ErrorState extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorState({required this.onRetry});
  @override Widget build(BuildContext context) => Padding(padding: const EdgeInsets.symmetric(vertical: 48), child: Column(children: [const Icon(Icons.cloud_off_outlined, size: 42), const SizedBox(height: 12), const Text('Could not synchronize this module.'), TextButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Try again'))]));
}
