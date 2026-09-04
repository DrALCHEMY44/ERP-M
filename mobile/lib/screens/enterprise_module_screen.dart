import 'package:flutter/material.dart';

import '../services/enterprise_api.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

enum EnterpriseModule { hr, payroll, accounting }

class EnterpriseModuleScreen extends StatefulWidget {
  final EnterpriseModule module;
  const EnterpriseModuleScreen({super.key, required this.module});

  @override
  State<EnterpriseModuleScreen> createState() => _EnterpriseModuleScreenState();
}

class _EnterpriseModuleScreenState extends State<EnterpriseModuleScreen> {
  bool _loading = true;
  String? _error;
  Map<String, dynamic> _data = const {};

  String get _route => '/${widget.module.name}';
  String get _title => switch (widget.module) {
    EnterpriseModule.hr => 'HR Operations',
    EnterpriseModule.payroll => 'Payroll',
    EnterpriseModule.accounting => 'Accounting',
  };
  IconData get _icon => switch (widget.module) {
    EnterpriseModule.hr => Icons.calendar_month_outlined,
    EnterpriseModule.payroll => Icons.payments_outlined,
    EnterpriseModule.accounting => Icons.account_balance_outlined,
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
      final data = switch (widget.module) {
        EnterpriseModule.hr => await EnterpriseApi.hr(),
        EnterpriseModule.payroll => await EnterpriseApi.payroll(),
        EnterpriseModule.accounting => await EnterpriseApi.accounting(),
      };
      if (mounted) setState(() => _data = data);
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _execute(
    Future<Map<String, dynamic>> Function() action,
    String success,
  ) async {
    setState(() => _loading = true);
    try {
      await action();
      await _load();
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(success)));
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
      if (mounted) setState(() => _loading = false);
    }
  }

  String _date(DateTime value) => value.toIso8601String().split('T').first;

  Future<void> _recordAttendance() async {
    final employees = (_data['employees'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    if (employees.isEmpty) return;
    var employeeId = employees.first['id'].toString();
    var status = 'PRESENT';
    var day = DateTime.now();
    final notes = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Record attendance'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: employeeId,
                decoration: const InputDecoration(labelText: 'Employee'),
                items: employees
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['id'].toString(),
                        child: Text(item['fullName'].toString()),
                      ),
                    )
                    .toList(),
                onChanged: (value) => employeeId = value ?? employeeId,
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: status,
                decoration: const InputDecoration(labelText: 'Status'),
                items:
                    ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'REMOTE', 'LEAVE']
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
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Date'),
                subtitle: Text(_date(day)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2020),
                    lastDate: DateTime.now(),
                    initialDate: day,
                  );
                  if (value != null) setDialogState(() => day = value);
                },
              ),
              TextField(
                controller: notes,
                maxLines: 2,
                decoration: const InputDecoration(labelText: 'Notes'),
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
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.hrAction({
          'action': 'recordAttendance',
          'employeeId': employeeId,
          'attendanceDate': _date(day),
          'status': status,
          'notes': notes.text.trim(),
        }),
        'Attendance recorded.',
      );
    }
    notes.dispose();
  }

  Future<void> _createLeave() async {
    final employees = (_data['employees'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    if (employees.isEmpty) return;
    var employeeId = employees.first['id'].toString();
    var type = 'ANNUAL';
    var start = DateTime.now();
    var end = DateTime.now().add(const Duration(days: 1));
    final reason = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create leave request'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: employeeId,
                decoration: const InputDecoration(labelText: 'Employee'),
                items: employees
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['id'].toString(),
                        child: Text(item['fullName'].toString()),
                      ),
                    )
                    .toList(),
                onChanged: (value) => employeeId = value ?? employeeId,
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: type,
                decoration: const InputDecoration(labelText: 'Leave type'),
                items:
                    [
                          'ANNUAL',
                          'SICK',
                          'MATERNITY',
                          'PATERNITY',
                          'COMPASSIONATE',
                          'UNPAID',
                          'OTHER',
                        ]
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                onChanged: (value) =>
                    setDialogState(() => type = value ?? type),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Start'),
                subtitle: Text(_date(start)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2020),
                    lastDate: DateTime.now().add(const Duration(days: 1095)),
                    initialDate: start,
                  );
                  if (value != null) setDialogState(() => start = value);
                },
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('End'),
                subtitle: Text(_date(end)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: start,
                    lastDate: DateTime.now().add(const Duration(days: 1095)),
                    initialDate: end.isBefore(start) ? start : end,
                  );
                  if (value != null) setDialogState(() => end = value);
                },
              ),
              TextField(
                controller: reason,
                maxLines: 2,
                decoration: const InputDecoration(labelText: 'Reason'),
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
      await _execute(
        () => EnterpriseApi.hrAction({
          'action': 'createLeave',
          'employeeId': employeeId,
          'leaveType': type,
          'startDate': _date(start),
          'endDate': _date(end),
          'requestedDays': end.difference(start).inDays + 1,
          'reason': reason.text.trim(),
        }),
        'Leave request created.',
      );
    }
    reason.dispose();
  }

  Future<void> _addEmploymentEvent() async {
    final employees = (_data['employees'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    if (employees.isEmpty) return;
    var employeeId = employees.first['id'].toString();
    var type = 'NOTE';
    var day = DateTime.now();
    final position = TextEditingController();
    final department = TextEditingController();
    final notes = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Employment event'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  initialValue: employeeId,
                  decoration: const InputDecoration(labelText: 'Employee'),
                  items: employees
                      .map(
                        (item) => DropdownMenuItem(
                          value: item['id'].toString(),
                          child: Text(item['fullName'].toString()),
                        ),
                      )
                      .toList(),
                  onChanged: (value) => employeeId = value ?? employeeId,
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: type,
                  decoration: const InputDecoration(labelText: 'Event'),
                  items:
                      [
                            'HIRE',
                            'PROMOTION',
                            'TRANSFER',
                            'LEAVE',
                            'RETURN',
                            'SUSPENSION',
                            'TERMINATION',
                            'NOTE',
                          ]
                          .map(
                            (value) => DropdownMenuItem(
                              value: value,
                              child: Text(value),
                            ),
                          )
                          .toList(),
                  onChanged: (value) =>
                      setDialogState(() => type = value ?? type),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Effective date'),
                  subtitle: Text(_date(day)),
                  onTap: () async {
                    final value = await showDatePicker(
                      context: context,
                      firstDate: DateTime(2000),
                      lastDate: DateTime.now().add(const Duration(days: 1095)),
                      initialDate: day,
                    );
                    if (value != null) setDialogState(() => day = value);
                  },
                ),
                TextField(
                  controller: position,
                  decoration: const InputDecoration(
                    labelText: 'Position (optional)',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: department,
                  decoration: const InputDecoration(
                    labelText: 'Department (optional)',
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: notes,
                  maxLines: 2,
                  decoration: const InputDecoration(labelText: 'Notes'),
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
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.hrAction({
          'action': 'addEmploymentEvent',
          'employeeId': employeeId,
          'eventType': type,
          'effectiveDate': _date(day),
          'position': position.text.trim(),
          'department': department.text.trim(),
          'notes': notes.text.trim(),
        }),
        'Employment event added.',
      );
    }
    for (final controller in [position, department, notes]) {
      controller.dispose();
    }
  }

  Future<void> _decideLeave(Map<String, dynamic> item, String decision) async {
    await _execute(
      () => EnterpriseApi.hrAction({
        'action': 'decideLeave',
        'requestId': item['id'],
        'decision': decision,
      }),
      'Leave request ${decision.toLowerCase()}.',
    );
  }

  Future<void> _generatePayroll() async {
    final now = DateTime.now();
    var start = DateTime(now.year, now.month, 1);
    var end = DateTime(now.year, now.month + 1, 0);
    var payDate = end;
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Generate payroll'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('Period start'),
                subtitle: Text(_date(start)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2020),
                    lastDate: DateTime(now.year + 2),
                    initialDate: start,
                  );
                  if (value != null) setDialogState(() => start = value);
                },
              ),
              ListTile(
                title: const Text('Period end'),
                subtitle: Text(_date(end)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: start,
                    lastDate: DateTime(now.year + 2),
                    initialDate: end,
                  );
                  if (value != null) setDialogState(() => end = value);
                },
              ),
              ListTile(
                title: const Text('Pay date'),
                subtitle: Text(_date(payDate)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: start,
                    lastDate: DateTime(now.year + 2),
                    initialDate: payDate,
                  );
                  if (value != null) setDialogState(() => payDate = value);
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
              child: const Text('Generate'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.payrollAction({
          'action': 'generate',
          'periodStart': _date(start),
          'periodEnd': _date(end),
          'payDate': _date(payDate),
        }),
        'Payroll generated.',
      );
    }
  }

  Future<void> _payrollSettings() async {
    final settings = _data['settings'] as Map<String, dynamic>? ?? const {};
    TextEditingController field(String key, Object fallback) =>
        TextEditingController(text: (settings[key] ?? fallback).toString());
    final currency = field('currency', 'FCFA');
    final professional = field('professionalExpenseRate', 30);
    final allowance = field('annualTaxAllowance', 500000);
    final surtax = field('localSurtaxRate', 10);
    final employeeSocial = field('employeeSocialRate', 4.2);
    final employerSocial = field('employerSocialRate', 11.2);
    final ceiling = field('socialMonthlyCeiling', 750000);
    final exempt = field('monthlyTaxExemptThreshold', 62000);
    final note = field(
      'complianceNote',
      'Confirm these values with a qualified local professional.',
    );
    var frequency = settings['payFrequency']?.toString() ?? 'MONTHLY';
    var compliance = settings['complianceStatus']?.toString() ?? 'DRAFT';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Payroll settings'),
          content: SizedBox(
            width: 560,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: currency,
                    decoration: const InputDecoration(labelText: 'Currency'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: frequency,
                    decoration: const InputDecoration(
                      labelText: 'Pay frequency',
                    ),
                    items: ['WEEKLY', 'BIWEEKLY', 'MONTHLY']
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) =>
                        setDialogState(() => frequency = value ?? frequency),
                  ),
                  const SizedBox(height: 10),
                  for (final entry in [
                    (professional, 'Professional expense rate %'),
                    (allowance, 'Annual tax allowance'),
                    (surtax, 'Local surtax rate %'),
                    (employeeSocial, 'Employee social rate %'),
                    (employerSocial, 'Employer social rate %'),
                    (ceiling, 'Social monthly ceiling'),
                    (exempt, 'Monthly tax-exempt threshold'),
                  ]) ...[
                    TextField(
                      controller: entry.$1,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(labelText: entry.$2),
                    ),
                    const SizedBox(height: 10),
                  ],
                  DropdownButtonFormField<String>(
                    initialValue: compliance,
                    decoration: const InputDecoration(
                      labelText: 'Compliance review',
                    ),
                    items: ['DRAFT', 'CONFIRMED']
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) =>
                        setDialogState(() => compliance = value ?? compliance),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: note,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Compliance note',
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
      ),
    );
    if (submit == true) {
      final brackets =
          settings['taxBrackets'] as List<dynamic>? ??
          const [
            {'upTo': null, 'rate': 0},
          ];
      await _execute(
        () => EnterpriseApi.payrollAction({
          'action': 'updateSettings',
          'currency': currency.text.trim(),
          'payFrequency': frequency,
          'professionalExpenseRate': double.parse(professional.text),
          'annualTaxAllowance': double.parse(allowance.text),
          'localSurtaxRate': double.parse(surtax.text),
          'employeeSocialRate': double.parse(employeeSocial.text),
          'employerSocialRate': double.parse(employerSocial.text),
          'socialMonthlyCeiling': double.parse(ceiling.text),
          'monthlyTaxExemptThreshold': double.parse(exempt.text),
          'taxBrackets': brackets,
          'complianceStatus': compliance,
          'complianceNote': note.text.trim(),
        }),
        'Payroll settings updated.',
      );
    }
    for (final controller in [
      currency,
      professional,
      allowance,
      surtax,
      employeeSocial,
      employerSocial,
      ceiling,
      exempt,
      note,
    ]) {
      controller.dispose();
    }
  }

  Future<void> _runPayroll(Map<String, dynamic> run, String action) async {
    if (action == 'pay') {
      var method = 'CASH';
      final banks = (_data['bankAccounts'] as List<dynamic>? ?? const [])
          .cast<Map<String, dynamic>>();
      String? bankId = banks.isEmpty ? null : banks.first['id'].toString();
      final submit = await showDialog<bool>(
        context: context,
        builder: (dialogContext) => StatefulBuilder(
          builder: (context, setDialogState) => AlertDialog(
            title: const Text('Pay payroll'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  initialValue: method,
                  decoration: const InputDecoration(labelText: 'Method'),
                  items: ['CASH', 'BANK']
                      .map(
                        (value) =>
                            DropdownMenuItem(value: value, child: Text(value)),
                      )
                      .toList(),
                  onChanged: (value) =>
                      setDialogState(() => method = value ?? method),
                ),
                if (method == 'BANK') ...[
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: bankId,
                    decoration: const InputDecoration(
                      labelText: 'Bank account',
                    ),
                    items: banks
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text(item['accountName'].toString()),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => bankId = value,
                  ),
                ],
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogContext, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(dialogContext, true),
                child: const Text('Pay'),
              ),
            ],
          ),
        ),
      );
      if (submit != true) return;
      await _execute(
        () => EnterpriseApi.payrollAction({
          'action': 'pay',
          'runId': run['id'],
          'method': method,
          'bankAccountId': method == 'BANK' ? bankId : null,
        }),
        'Payroll marked paid.',
      );
      return;
    }
    await _execute(
      () => EnterpriseApi.payrollAction({'action': action, 'runId': run['id']}),
      'Payroll ${action}d.',
    );
  }

  Future<void> _createAccount() async {
    final code = TextEditingController();
    final name = TextEditingController();
    final description = TextEditingController();
    var type = 'ASSET';
    var normal = 'DEBIT';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create ledger account'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: code,
                decoration: const InputDecoration(labelText: 'Account code'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: name,
                decoration: const InputDecoration(labelText: 'Account name'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: type,
                decoration: const InputDecoration(labelText: 'Type'),
                items: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']
                    .map(
                      (value) =>
                          DropdownMenuItem(value: value, child: Text(value)),
                    )
                    .toList(),
                onChanged: (value) => setDialogState(() {
                  type = value ?? type;
                  normal = ['ASSET', 'EXPENSE'].contains(type)
                      ? 'DEBIT'
                      : 'CREDIT';
                }),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                key: ValueKey(normal),
                initialValue: normal,
                decoration: const InputDecoration(labelText: 'Normal balance'),
                items: ['DEBIT', 'CREDIT']
                    .map(
                      (value) =>
                          DropdownMenuItem(value: value, child: Text(value)),
                    )
                    .toList(),
                onChanged: (value) =>
                    setDialogState(() => normal = value ?? normal),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: description,
                decoration: const InputDecoration(labelText: 'Description'),
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
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'createAccount',
          'code': code.text.trim(),
          'name': name.text.trim(),
          'accountType': type,
          'normalBalance': normal,
          'description': description.text.trim(),
        }),
        'Ledger account created.',
      );
    }
    for (final controller in [code, name, description]) {
      controller.dispose();
    }
  }

  Future<void> _postJournal() async {
    final accounts = (_data['accounts'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    if (accounts.length < 2) {
      await _execute(
        () => EnterpriseApi.accountingAction({'action': 'bootstrap'}),
        'Default accounts created.',
      );
      return;
    }
    var debitId = accounts.first['id'].toString();
    var creditId = accounts[1]['id'].toString();
    final reference = TextEditingController(
      text: 'MAN-${DateTime.now().millisecondsSinceEpoch}',
    );
    final description = TextEditingController();
    final amount = TextEditingController();
    var day = DateTime.now();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Post manual journal'),
          content: SizedBox(
            width: 560,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: reference,
                    decoration: const InputDecoration(labelText: 'Reference'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: description,
                    decoration: const InputDecoration(labelText: 'Description'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: amount,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Amount'),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: debitId,
                    decoration: const InputDecoration(
                      labelText: 'Debit account',
                    ),
                    items: accounts
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text('${item['code']} — ${item['name']}'),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => debitId = value ?? debitId,
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    initialValue: creditId,
                    decoration: const InputDecoration(
                      labelText: 'Credit account',
                    ),
                    items: accounts
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text('${item['code']} — ${item['name']}'),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => creditId = value ?? creditId,
                  ),
                  ListTile(
                    title: const Text('Entry date'),
                    subtitle: Text(_date(day)),
                    onTap: () async {
                      final value = await showDatePicker(
                        context: context,
                        firstDate: DateTime(2000),
                        lastDate: DateTime.now(),
                        initialDate: day,
                      );
                      if (value != null) setDialogState(() => day = value);
                    },
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
              child: const Text('Post'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      final value = double.tryParse(amount.text) ?? 0;
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'postJournal',
          'entryDate': _date(day),
          'reference': reference.text.trim(),
          'description': description.text.trim(),
          'lines': [
            {'accountId': debitId, 'debit': value, 'credit': 0},
            {'accountId': creditId, 'debit': 0, 'credit': value},
          ],
        }),
        'Journal posted.',
      );
    }
    for (final controller in [reference, description, amount]) {
      controller.dispose();
    }
  }

  Future<void> _createPeriod() async {
    final name = TextEditingController();
    var start = DateTime(DateTime.now().year, 1, 1);
    var end = DateTime(DateTime.now().year, 12, 31);
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create fiscal period'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: name,
                decoration: const InputDecoration(labelText: 'Period name'),
              ),
              ListTile(
                title: const Text('Starts'),
                subtitle: Text(_date(start)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                    initialDate: start,
                  );
                  if (value != null) setDialogState(() => start = value);
                },
              ),
              ListTile(
                title: const Text('Ends'),
                subtitle: Text(_date(end)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: start,
                    lastDate: DateTime(2100),
                    initialDate: end,
                  );
                  if (value != null) setDialogState(() => end = value);
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
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'createPeriod',
          'name': name.text.trim(),
          'startsOn': _date(start),
          'endsOn': _date(end),
        }),
        'Fiscal period created.',
      );
    }
    name.dispose();
  }

  Future<void> _createBank() async {
    final account = TextEditingController();
    final bank = TextEditingController();
    final number = TextEditingController();
    final balance = TextEditingController(text: '0');
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Create bank account'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: account,
              decoration: const InputDecoration(labelText: 'Account name'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: bank,
              decoration: const InputDecoration(labelText: 'Bank name'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: number,
              decoration: const InputDecoration(labelText: 'Masked number'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: balance,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Opening balance'),
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
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'createBankAccount',
          'accountName': account.text.trim(),
          'bankName': bank.text.trim(),
          'maskedAccountNumber': number.text.trim(),
          'currency': 'FCFA',
          'openingBalance': double.tryParse(balance.text) ?? 0,
        }),
        'Bank account created.',
      );
    }
    for (final controller in [account, bank, number, balance]) {
      controller.dispose();
    }
  }

  Future<void> _createAccountingDocument({required bool receivable}) async {
    final parties =
        (_data[receivable ? 'customers' : 'suppliers'] as List<dynamic>? ??
                const [])
            .cast<Map<String, dynamic>>();
    if (parties.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Create a ${receivable ? 'customer' : 'supplier'} before recording this document.',
          ),
        ),
      );
      return;
    }
    var partyId = parties.first['id'].toString();
    var issueDate = DateTime.now();
    var dueDate = issueDate.add(const Duration(days: 30));
    final number = TextEditingController();
    final description = TextEditingController();
    final amount = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(
            receivable ? 'Create customer invoice' : 'Create supplier bill',
          ),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    initialValue: partyId,
                    decoration: InputDecoration(
                      labelText: receivable ? 'Customer' : 'Supplier',
                    ),
                    items: parties
                        .map(
                          (item) => DropdownMenuItem(
                            value: item['id'].toString(),
                            child: Text(item['name'].toString()),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => partyId = value ?? partyId,
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: number,
                    decoration: InputDecoration(
                      labelText: receivable ? 'Invoice number' : 'Bill number',
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: description,
                    decoration: const InputDecoration(labelText: 'Description'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: amount,
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    decoration: const InputDecoration(
                      labelText: 'Total amount',
                    ),
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Issue date'),
                    subtitle: Text(_date(issueDate)),
                    onTap: () async {
                      final value = await showDatePicker(
                        context: context,
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                        initialDate: issueDate,
                      );
                      if (value != null) {
                        setDialogState(() {
                          issueDate = value;
                          if (dueDate.isBefore(issueDate)) dueDate = issueDate;
                        });
                      }
                    },
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Due date'),
                    subtitle: Text(_date(dueDate)),
                    onTap: () async {
                      final value = await showDatePicker(
                        context: context,
                        firstDate: issueDate,
                        lastDate: DateTime(2100),
                        initialDate: dueDate.isBefore(issueDate)
                            ? issueDate
                            : dueDate,
                      );
                      if (value != null) setDialogState(() => dueDate = value);
                    },
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
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': receivable ? 'createReceivable' : 'createPayable',
          receivable ? 'customerId' : 'supplierId': partyId,
          receivable ? 'invoiceNumber' : 'billNumber': number.text.trim(),
          'issueDate': _date(issueDate),
          'dueDate': _date(dueDate),
          'description': description.text.trim(),
          'totalAmount': double.tryParse(amount.text) ?? 0,
        }),
        receivable ? 'Customer invoice created.' : 'Supplier bill created.',
      );
    }
    for (final controller in [number, description, amount]) {
      controller.dispose();
    }
  }

  Future<void> _recordAccountingPayment(
    Map<String, dynamic> document, {
    required bool receivable,
  }) async {
    final banks = (_data['bankAccounts'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    var method = 'CASH';
    String? bankId = banks.isEmpty ? null : banks.first['id'].toString();
    var paymentDate = DateTime.now();
    final amount = TextEditingController(
      text: ((document['outstanding'] as num?)?.toDouble() ?? 0)
          .toStringAsFixed(0),
    );
    final reference = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(
            receivable ? 'Record customer receipt' : 'Pay supplier bill',
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: amount,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(labelText: 'Amount'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: method,
                decoration: const InputDecoration(labelText: 'Method'),
                items: const [
                  DropdownMenuItem(value: 'CASH', child: Text('Cash')),
                  DropdownMenuItem(value: 'BANK', child: Text('Bank')),
                ],
                onChanged: (value) =>
                    setDialogState(() => method = value ?? method),
              ),
              if (method == 'BANK') ...[
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: bankId,
                  decoration: const InputDecoration(labelText: 'Bank account'),
                  items: banks
                      .map(
                        (item) => DropdownMenuItem(
                          value: item['id'].toString(),
                          child: Text(item['accountName'].toString()),
                        ),
                      )
                      .toList(),
                  onChanged: (value) => bankId = value,
                ),
              ],
              const SizedBox(height: 10),
              TextField(
                controller: reference,
                decoration: const InputDecoration(labelText: 'Reference'),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Payment date'),
                subtitle: Text(_date(paymentDate)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2000),
                    lastDate: DateTime.now(),
                    initialDate: paymentDate,
                  );
                  if (value != null) {
                    setDialogState(() => paymentDate = value);
                  }
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
              onPressed: method == 'BANK' && bankId == null
                  ? null
                  : () => Navigator.pop(dialogContext, true),
              child: const Text('Record'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'recordPayment',
          'direction': receivable ? 'RECEIPT' : 'PAYMENT',
          'documentId': document['id'],
          'paymentDate': _date(paymentDate),
          'amount': double.tryParse(amount.text) ?? 0,
          'method': method,
          'bankAccountId': method == 'BANK' ? bankId : null,
          'reference': reference.text.trim(),
        }),
        receivable
            ? 'Customer receipt recorded.'
            : 'Supplier payment recorded.',
      );
    }
    amount.dispose();
    reference.dispose();
  }

  Future<void> _importBankTransaction() async {
    final banks = (_data['bankAccounts'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    if (banks.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Create a bank account first.')),
      );
      return;
    }
    var bankId = banks.first['id'].toString();
    var transactionDate = DateTime.now();
    final description = TextEditingController();
    final reference = TextEditingController();
    final amount = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Import bank transaction'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: bankId,
                decoration: const InputDecoration(labelText: 'Bank account'),
                items: banks
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['id'].toString(),
                        child: Text(item['accountName'].toString()),
                      ),
                    )
                    .toList(),
                onChanged: (value) => bankId = value ?? bankId,
              ),
              const SizedBox(height: 10),
              TextField(
                controller: description,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: reference,
                decoration: const InputDecoration(labelText: 'Reference'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amount,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                  signed: true,
                ),
                decoration: const InputDecoration(
                  labelText: 'Amount',
                  helperText:
                      'Use a negative amount for money leaving the bank.',
                ),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Transaction date'),
                subtitle: Text(_date(transactionDate)),
                onTap: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2000),
                    lastDate: DateTime.now(),
                    initialDate: transactionDate,
                  );
                  if (value != null) {
                    setDialogState(() => transactionDate = value);
                  }
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
              child: const Text('Import'),
            ),
          ],
        ),
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'importBankTransaction',
          'bankAccountId': bankId,
          'transactionDate': _date(transactionDate),
          'description': description.text.trim(),
          'reference': reference.text.trim(),
          'amount': double.tryParse(amount.text) ?? 0,
        }),
        'Bank transaction imported.',
      );
    }
    for (final controller in [description, reference, amount]) {
      controller.dispose();
    }
  }

  Future<void> _reconcileBankTransaction(
    Map<String, dynamic> transaction,
  ) async {
    final bankAccounts = (_data['bankAccounts'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
    final bank = bankAccounts
        .where((item) => item['id'] == transaction['bankAccountId'])
        .firstOrNull;
    final ledgerAccountId = bank?['ledgerAccountId']?.toString();
    final targetAmount = (transaction['amount'] as num?)?.toDouble() ?? 0;
    final entries = (_data['entries'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>()
        .where((entry) {
          if (entry['status'] != 'POSTED' || ledgerAccountId == null) {
            return false;
          }
          final lines = (entry['lines'] as List<dynamic>? ?? const []);
          final matchedAmount = lines
              .cast<Map<String, dynamic>>()
              .where((line) => line['accountId']?.toString() == ledgerAccountId)
              .fold<double>(
                0,
                (sum, line) =>
                    sum +
                    ((line['debit'] as num?)?.toDouble() ?? 0) -
                    ((line['credit'] as num?)?.toDouble() ?? 0),
              );
          return (matchedAmount - targetAmount).abs() < 0.009;
        })
        .toList();
    if (entries.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No posted journal matches this bank transaction.'),
        ),
      );
      return;
    }
    var journalId = entries.first['id'].toString();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Reconcile bank transaction'),
        content: DropdownButtonFormField<String>(
          initialValue: journalId,
          decoration: const InputDecoration(labelText: 'Matching journal'),
          items: entries
              .map(
                (item) => DropdownMenuItem(
                  value: item['id'].toString(),
                  child: Text('${item['reference']} · ${item['entryDate']}'),
                ),
              )
              .toList(),
          onChanged: (value) => journalId = value ?? journalId,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Reconcile'),
          ),
        ],
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'reconcileBankTransaction',
          'transactionId': transaction['id'],
          'journalEntryId': journalId,
        }),
        'Bank transaction reconciled.',
      );
    }
  }

  Future<void> _reverseJournal(Map<String, dynamic> entry) async {
    final reason = TextEditingController();
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Reverse journal'),
        content: TextField(
          controller: reason,
          decoration: const InputDecoration(labelText: 'Reason'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Reverse'),
          ),
        ],
      ),
    );
    if (submit == true) {
      await _execute(
        () => EnterpriseApi.accountingAction({
          'action': 'reverseJournal',
          'entryId': entry['id'],
          'reason': reason.text.trim(),
        }),
        'Journal reversed.',
      );
    }
    reason.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          _title,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        actions: [
          IconButton(onPressed: _load, icon: const Icon(Icons.refresh_rounded)),
        ],
      ),
      drawer: AppDrawer(currentRoute: _route),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          children: [
            _Header(title: _title, icon: _icon),
            const SizedBox(height: 18),
            if (_loading)
              const Padding(
                padding: EdgeInsets.all(48),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_error != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    _error!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              )
            else
              ..._content(),
          ],
        ),
      ),
    );
  }

  List<Widget> _content() => switch (widget.module) {
    EnterpriseModule.hr => _hrContent(),
    EnterpriseModule.payroll => _payrollContent(),
    EnterpriseModule.accounting => _accountingContent(),
  };

  List<Widget> _hrContent() {
    final employees = (_data['employees'] as List<dynamic>? ?? const []);
    final attendance = (_data['attendance'] as List<dynamic>? ?? const []);
    final leave = (_data['leaveRequests'] as List<dynamic>? ?? const []);
    final events = (_data['events'] as List<dynamic>? ?? const []);
    return [
      if (AuthService.hasPermission('manageHr'))
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.icon(
              onPressed: _recordAttendance,
              icon: const Icon(Icons.how_to_reg),
              label: const Text('Attendance'),
            ),
            OutlinedButton.icon(
              onPressed: _createLeave,
              icon: const Icon(Icons.beach_access_outlined),
              label: const Text('Leave'),
            ),
            OutlinedButton.icon(
              onPressed: _addEmploymentEvent,
              icon: const Icon(Icons.history_edu),
              label: const Text('Employment event'),
            ),
          ],
        ),
      if (AuthService.hasPermission('manageHr')) const SizedBox(height: 16),
      _Metrics(
        values: {
          'Employees': employees.length.toString(),
          'Attendance': attendance.length.toString(),
          'Leave': leave.length.toString(),
        },
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Recent leave requests',
        records: leave,
        titleKey: 'employeeName',
        subtitle: (item) =>
            '${item['leaveType']} · ${item['startDate']} to ${item['endDate']}',
        meta: (item) => '${item['status']} · ${item['requestedDays']} day(s)',
        trailing: (item) =>
            item['status'] == 'PENDING' && AuthService.hasPermission('manageHr')
            ? PopupMenuButton<String>(
                onSelected: (value) => _decideLeave(item, value),
                itemBuilder: (_) => const [
                  PopupMenuItem(value: 'APPROVED', child: Text('Approve')),
                  PopupMenuItem(value: 'REJECTED', child: Text('Reject')),
                  PopupMenuItem(
                    value: 'CANCELLED',
                    child: Text('Cancel request'),
                  ),
                ],
              )
            : null,
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Employment history',
        records: events,
        titleKey: 'employeeName',
        subtitle: (item) => '${item['eventType']} · ${item['effectiveDate']}',
        meta: (item) => item['notes']?.toString() ?? 'No note',
      ),
    ];
  }

  List<Widget> _payrollContent() {
    final settings = _data['settings'] as Map<String, dynamic>? ?? const {};
    final runs = (_data['runs'] as List<dynamic>? ?? const []);
    return [
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          if (AuthService.hasPermission('managePayroll'))
            FilledButton.icon(
              onPressed: _generatePayroll,
              icon: const Icon(Icons.calculate_outlined),
              label: const Text('Generate payroll'),
            ),
          if (AuthService.hasPermission('managePayroll') ||
              AuthService.hasPermission('approvePayroll'))
            OutlinedButton.icon(
              onPressed: _payrollSettings,
              icon: const Icon(Icons.tune),
              label: const Text('Payroll settings'),
            ),
        ],
      ),
      const SizedBox(height: 12),
      if (settings['complianceStatus'] != 'CONFIRMED')
        const Card(
          color: Color(0xFFFFF7ED),
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'Posting is locked until the Business Owner confirms professionally reviewed payroll settings.',
              style: TextStyle(color: Color(0xFF9A3412)),
            ),
          ),
        ),
      const SizedBox(height: 12),
      _Records(
        title: 'Pay runs',
        records: runs,
        titleKey: 'status',
        subtitle: (item) => '${item['periodStart']} to ${item['periodEnd']}',
        meta: (item) =>
            '${_money(item['totalNet'])} net · ${item['employeeCount']} staff',
        trailing: (item) {
          final status = item['status']?.toString();
          return PopupMenuButton<String>(
            onSelected: (value) => _runPayroll(item, value),
            itemBuilder: (_) => [
              if (status == 'DRAFT' &&
                  AuthService.hasPermission('approvePayroll'))
                const PopupMenuItem(value: 'approve', child: Text('Approve')),
              if (status == 'DRAFT' &&
                  AuthService.hasPermission('managePayroll'))
                const PopupMenuItem(value: 'void', child: Text('Void draft')),
              if (status == 'APPROVED' &&
                  AuthService.hasPermission('approvePayroll'))
                const PopupMenuItem(
                  value: 'post',
                  child: Text('Post to accounting'),
                ),
              if (status == 'POSTED' &&
                  AuthService.hasPermission('approvePayroll'))
                const PopupMenuItem(value: 'pay', child: Text('Mark paid')),
            ],
          );
        },
      ),
    ];
  }

  List<Widget> _accountingContent() {
    final balance = _data['balanceSheet'] as Map<String, dynamic>? ?? const {};
    final income =
        _data['incomeStatement'] as Map<String, dynamic>? ?? const {};
    final accounts = (_data['accounts'] as List<dynamic>? ?? const []);
    final entries = (_data['entries'] as List<dynamic>? ?? const []);
    final periods = (_data['periods'] as List<dynamic>? ?? const []);
    final receivables = (_data['receivables'] as List<dynamic>? ?? const []);
    final payables = (_data['payables'] as List<dynamic>? ?? const []);
    final bankAccounts = (_data['bankAccounts'] as List<dynamic>? ?? const []);
    final bankTransactions =
        (_data['bankTransactions'] as List<dynamic>? ?? const []);
    return [
      if (AuthService.hasPermission('manageAccounting'))
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.icon(
              onPressed: _postJournal,
              icon: const Icon(Icons.post_add),
              label: const Text('Post journal'),
            ),
            OutlinedButton.icon(
              onPressed: _createAccount,
              icon: const Icon(Icons.account_tree_outlined),
              label: const Text('Account'),
            ),
            OutlinedButton.icon(
              onPressed: _createPeriod,
              icon: const Icon(Icons.date_range),
              label: const Text('Period'),
            ),
            OutlinedButton.icon(
              onPressed: _createBank,
              icon: const Icon(Icons.account_balance),
              label: const Text('Bank'),
            ),
            OutlinedButton.icon(
              onPressed: () => _createAccountingDocument(receivable: true),
              icon: const Icon(Icons.request_quote_outlined),
              label: const Text('Customer invoice'),
            ),
            OutlinedButton.icon(
              onPressed: () => _createAccountingDocument(receivable: false),
              icon: const Icon(Icons.receipt_long_outlined),
              label: const Text('Supplier bill'),
            ),
            OutlinedButton.icon(
              onPressed: _importBankTransaction,
              icon: const Icon(Icons.upload_file_outlined),
              label: const Text('Bank transaction'),
            ),
            OutlinedButton.icon(
              onPressed: () => _execute(
                () => EnterpriseApi.accountingAction({
                  'action': 'syncOperational',
                }),
                'Sales and expenses synchronized.',
              ),
              icon: const Icon(Icons.sync),
              label: const Text('Sync operations'),
            ),
          ],
        ),
      if (AuthService.hasPermission('manageAccounting'))
        const SizedBox(height: 16),
      _Metrics(
        values: {
          'Assets': _money(balance['assets']),
          'Liabilities': _money(balance['liabilities']),
          'Net result': _money(income['netIncome']),
          'Receivable': _money(
            receivables.fold<num>(
              0,
              (sum, item) =>
                  sum +
                  (((item as Map<String, dynamic>)['outstanding'] as num?) ??
                      0),
            ),
          ),
          'Payable': _money(
            payables.fold<num>(
              0,
              (sum, item) =>
                  sum +
                  (((item as Map<String, dynamic>)['outstanding'] as num?) ??
                      0),
            ),
          ),
        },
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Customer receivables',
        records: receivables,
        titleKey: 'invoiceNumber',
        subtitle: (item) => '${item['customerName']} · due ${item['dueDate']}',
        meta: (item) =>
            '${item['status']} · ${_money(item['outstanding'])} outstanding',
        trailing: (item) =>
            AuthService.hasPermission('manageAccounting') &&
                ['OPEN', 'PARTIAL'].contains(item['status'])
            ? TextButton(
                onPressed: () =>
                    _recordAccountingPayment(item, receivable: true),
                child: const Text('Receive'),
              )
            : null,
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Supplier payables',
        records: payables,
        titleKey: 'billNumber',
        subtitle: (item) => '${item['supplierName']} · due ${item['dueDate']}',
        meta: (item) =>
            '${item['status']} · ${_money(item['outstanding'])} outstanding',
        trailing: (item) =>
            AuthService.hasPermission('manageAccounting') &&
                ['OPEN', 'PARTIAL'].contains(item['status'])
            ? TextButton(
                onPressed: () =>
                    _recordAccountingPayment(item, receivable: false),
                child: const Text('Pay'),
              )
            : null,
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Bank statement',
        records: bankTransactions,
        titleKey: 'description',
        subtitle: (item) =>
            '${item['accountName']} · ${item['transactionDate']}',
        meta: (item) => '${item['status']} · ${_money(item['amount'])}',
        trailing: (item) =>
            AuthService.hasPermission('manageAccounting') &&
                item['status'] == 'UNMATCHED'
            ? TextButton(
                onPressed: () => _reconcileBankTransaction(item),
                child: const Text('Match'),
              )
            : null,
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Bank accounts',
        records: bankAccounts,
        titleKey: 'accountName',
        subtitle: (item) => '${item['bankName']} · ${item['currency']}',
        meta: (item) => '${_money(item['ledgerBalance'])} ledger balance',
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Chart of accounts',
        records: accounts,
        titleKey: 'name',
        subtitle: (item) => '${item['code']} · ${item['accountType']}',
        meta: (item) => '${_money(item['balance'])} balance',
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Posted journal',
        records: entries,
        titleKey: 'reference',
        subtitle: (item) => '${item['entryDate']} · ${item['sourceType']}',
        meta: (item) => item['description']?.toString() ?? '',
        trailing: (item) =>
            AuthService.hasPermission('manageAccounting') &&
                item['status'] == 'POSTED' &&
                item['reversalOfId'] == null
            ? IconButton(
                onPressed: () => _reverseJournal(item),
                icon: const Icon(Icons.undo),
                tooltip: 'Reverse journal',
              )
            : null,
      ),
      const SizedBox(height: 16),
      _Records(
        title: 'Fiscal periods',
        records: periods,
        titleKey: 'name',
        subtitle: (item) => '${item['startsOn']} to ${item['endsOn']}',
        meta: (item) => item['status']?.toString() ?? '',
        trailing: (item) =>
            item['status'] == 'OPEN' &&
                AuthService.hasPermission('closeAccounting')
            ? TextButton(
                onPressed: () => _execute(
                  () => EnterpriseApi.accountingAction({
                    'action': 'closePeriod',
                    'periodId': item['id'],
                  }),
                  'Fiscal period closed.',
                ),
                child: const Text('Close'),
              )
            : null,
      ),
    ];
  }

  String _money(dynamic value) =>
      '${((value as num?)?.toDouble() ?? 0).toStringAsFixed(0)} FCFA';
}

class _Header extends StatelessWidget {
  final String title;
  final IconData icon;
  const _Header({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      gradient: const LinearGradient(
        colors: [Color(0xFF1E3A8A), Color(0xFF4F46E5)],
      ),
      borderRadius: BorderRadius.circular(24),
    ),
    child: Row(
      children: [
        Icon(icon, color: Colors.white, size: 32),
        const SizedBox(width: 14),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ],
    ),
  );
}

class _Metrics extends StatelessWidget {
  final Map<String, String> values;
  const _Metrics({required this.values});

  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 10,
    runSpacing: 10,
    children: values.entries
        .map(
          (entry) => SizedBox(
            width: 155,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.key,
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      entry.value,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
        .toList(),
  );
}

class _Records extends StatelessWidget {
  final String title;
  final List<dynamic> records;
  final String titleKey;
  final String Function(Map<String, dynamic>) subtitle;
  final String Function(Map<String, dynamic>) meta;
  final Widget? Function(Map<String, dynamic>)? trailing;
  const _Records({
    required this.title,
    required this.records,
    required this.titleKey,
    required this.subtitle,
    required this.meta,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          if (records.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 18),
              child: Text('No records yet.'),
            )
          else
            ...records.take(50).map((raw) {
              final item = raw as Map<String, dynamic>;
              return ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(item[titleKey]?.toString() ?? 'Record'),
                subtitle: Text('${subtitle(item)}\n${meta(item)}'),
                isThreeLine: true,
                trailing: trailing?.call(item),
              );
            }),
        ],
      ),
    ),
  );
}
