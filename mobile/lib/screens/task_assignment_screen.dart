import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/core_provider.dart';
import '../providers/task_provider.dart';
import '../models/erp_task.dart';
import '../models/app_user.dart';
import '../services/api_service.dart';

class TaskAssignmentScreen extends StatefulWidget {
  const TaskAssignmentScreen({super.key});

  @override
  State<TaskAssignmentScreen> createState() => _TaskAssignmentScreenState();
}

class _TaskAssignmentScreenState extends State<TaskAssignmentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();

  String? _selectedEmployeeId;
  String? _selectedEmployeeName;
  TaskPriority _selectedPriority = TaskPriority.medium;
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 3));
  List<AppUser> _tenantEmployees = const [];
  String? _employeeLoadError;

  @override
  void initState() {
    super.initState();
    _loadEmployees();
  }

  Future<void> _loadEmployees() async {
    try {
      final result = await ApiService.request(
        '/api/data',
        method: 'POST',
        body: {'operation': 'listTaskAssigneesByBusiness', 'variables': {}},
      );
      final rows = ((result['data'] as Map<String, dynamic>)['users'] as List)
          .cast<Map<String, dynamic>>();
      if (!mounted) return;
      setState(() {
        _tenantEmployees = rows
            .map(
              (row) => AppUser(
                id: row['id'] as String,
                name: row['fullName'] as String? ?? '',
                email: row['email'] as String? ?? '',
                tenantId: row['tenantId'] as String,
                businessId: row['businessId'] as String,
                role: UserRole.fromString(row['role'] as String),
              ),
            )
            .toList();
      });
    } catch (error) {
      if (mounted) setState(() => _employeeLoadError = error.toString());
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final tenantEmployees = _tenantEmployees;

    return Scaffold(
      appBar: AppBar(title: const Text('New Task Assignment')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Assign operational tasks to your team members in this tenant workspace.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 24),
              if (_employeeLoadError != null) ...[
                Text(
                  'Could not load the authorized employee directory: $_employeeLoadError',
                  style: TextStyle(color: theme.colorScheme.error),
                ),
                const SizedBox(height: 16),
              ],

              // Title
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  labelText: 'Task Title',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Task title is required'
                    : null,
              ),
              const SizedBox(height: 16),

              // Assignee Dropdown
              DropdownButtonFormField<String>(
                decoration: InputDecoration(
                  labelText: 'Assign To Employee',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                initialValue: _selectedEmployeeId,
                items: tenantEmployees
                    .map(
                      (emp) => DropdownMenuItem(
                        value: emp.id,
                        child: Text('${emp.name} (${emp.role.displayName})'),
                      ),
                    )
                    .toList(),
                onChanged: (val) {
                  setState(() {
                    _selectedEmployeeId = val;
                    _selectedEmployeeName = tenantEmployees
                        .firstWhere((e) => e.id == val)
                        .name;
                  });
                },
                validator: (value) =>
                    value == null ? 'Please select an employee' : null,
              ),
              const SizedBox(height: 16),

              // Priority Selection
              DropdownButtonFormField<TaskPriority>(
                initialValue: _selectedPriority,
                decoration: InputDecoration(
                  labelText: 'Priority Level',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                items: TaskPriority.values
                    .map(
                      (p) => DropdownMenuItem(
                        value: p,
                        child: Text(p.displayName),
                      ),
                    )
                    .toList(),
                onChanged: (val) => setState(() => _selectedPriority = val!),
              ),
              const SizedBox(height: 16),

              // Description
              TextFormField(
                controller: _descController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Task Description',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignLabelWithHint: true,
                ),
              ),
              const SizedBox(height: 16),

              // Due Date Picker Row
              InkWell(
                onTap: () => _selectDate(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade400),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Due Date: ${_selectedDate.toString().split(' ')[0]}',
                        style: const TextStyle(fontSize: 15),
                      ),
                      Icon(
                        Icons.calendar_month,
                        color: theme.colorScheme.primary,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              FilledButton.icon(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    final success = await taskProvider.assignTask(
                      _titleController.text,
                      _descController.text,
                      _selectedEmployeeId!,
                      _selectedEmployeeName!,
                      _selectedPriority,
                      _selectedDate,
                      core,
                    );

                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            success
                                ? 'Task assigned successfully!'
                                : 'Failed: Unauthorized access.',
                          ),
                          backgroundColor: success ? Colors.green : Colors.red,
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                      Navigator.pop(context);
                    }
                  }
                },
                icon: const Icon(Icons.send),
                label: const Text(
                  'Assign Task',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
