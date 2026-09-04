import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/erp_task.dart';
import '../models/app_user.dart';
import '../providers/core_provider.dart';
import '../providers/task_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class TasksListScreen extends StatefulWidget {
  const TasksListScreen({super.key});

  @override
  State<TasksListScreen> createState() => _TasksListScreenState();
}

class _TasksListScreenState extends State<TasksListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: AuthService.currentUser?.role == UserRole.staff ? 1 : 4,
      vsync: this,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _updateStatus(ErpTask task) async {
    final taskProvider = context.read<TaskProvider>();
    var status = task.status;
    final save = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text('Update ${task.title}'),
          content: DropdownButtonFormField<TaskStatus>(
            initialValue: status,
            decoration: const InputDecoration(
              labelText: 'Authoritative status',
            ),
            items:
                const [
                      TaskStatus.pending,
                      TaskStatus.ongoing,
                      TaskStatus.completed,
                      TaskStatus.cancelled,
                    ]
                    .map(
                      (value) => DropdownMenuItem(
                        value: value,
                        child: Text(value.displayName),
                      ),
                    )
                    .toList(),
            onChanged: (value) =>
                setDialogState(() => status = value ?? status),
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
    if (save != true) return;
    if (!mounted) return;
    final success = await taskProvider.updateTaskStatus(task.id, status);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? 'Task status updated.' : 'Not authorized.'),
        ),
      );
    }
  }

  Future<void> _editTask(ErpTask task) async {
    final taskProvider = context.read<TaskProvider>();
    final title = TextEditingController(text: task.title);
    final description = TextEditingController(text: task.description);
    var priority = task.priority;
    var dueDate = task.dueDate;
    final save = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Edit task'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: title,
                  decoration: const InputDecoration(labelText: 'Title'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: description,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Description'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<TaskPriority>(
                  initialValue: priority,
                  decoration: const InputDecoration(labelText: 'Priority'),
                  items: TaskPriority.values
                      .map(
                        (value) => DropdownMenuItem(
                          value: value,
                          child: Text(value.displayName),
                        ),
                      )
                      .toList(),
                  onChanged: (value) =>
                      setDialogState(() => priority = value ?? priority),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Due date'),
                  subtitle: Text(dueDate.toString().split(' ').first),
                  trailing: const Icon(Icons.calendar_month),
                  onTap: () async {
                    final value = await showDatePicker(
                      context: context,
                      initialDate: dueDate.isBefore(DateTime.now())
                          ? DateTime.now()
                          : dueDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 1095)),
                    );
                    if (value != null) setDialogState(() => dueDate = value);
                  },
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
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    if (!mounted) return;
    if (save == true && title.text.trim().isNotEmpty) {
      await taskProvider.updateTask(
        task,
        title: title.text.trim(),
        description: description.text.trim(),
        priority: priority,
        dueDate: dueDate,
      );
    }
    title.dispose();
    description.dispose();
  }

  Future<void> _deleteTask(ErpTask task) async {
    final taskProvider = context.read<TaskProvider>();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete task?'),
        content: Text('Delete “${task.title}”?'),
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
    if (!mounted) return;
    if (confirmed == true) {
      await taskProvider.deleteTask(task.id);
    }
  }

  Future<void> _finishTask(ErpTask task) async {
    final core = context.read<CoreProvider>();
    final taskProvider = context.read<TaskProvider>();
    final success = await taskProvider.updateTaskProgress(task.id, 100, core);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success ? 'Task marked as finished.' : 'Could not finish this task.',
        ),
        backgroundColor: success ? Colors.green : Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final currentUserId = AuthService.currentUser?.id ?? '';
    final isEmployee = AuthService.currentUser?.role == UserRole.staff;

    // Isolated lists based on tab filter
    final allTasks = taskProvider.tasks;
    final myTasks = taskProvider.tasks
        .where((t) => t.assignedToId == currentUserId)
        .toList();

    final dueSoonTasks = taskProvider.tasks.where((t) {
      if (t.status == TaskStatus.completed) return false;
      final diff = t.dueDate.difference(DateTime.now()).inDays;
      return diff >= 0 && diff <= 3;
    }).toList();

    final overdueTasks = taskProvider.tasks.where((t) => t.isOverdue).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Management'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: isEmployee
              ? const [Tab(text: 'My Assigned Tasks')]
              : const [
                  Tab(text: 'All Tasks'),
                  Tab(text: 'My Tasks'),
                  Tab(text: 'Due Soon'),
                  Tab(text: 'Overdue'),
                ],
        ),
      ),
      drawer: const AppDrawer(currentRoute: '/tasks'),
      body: TabBarView(
        controller: _tabController,
        children: isEmployee
            ? [_buildTaskList(myTasks, theme)]
            : [
                _buildTaskList(allTasks, theme),
                _buildTaskList(myTasks, theme),
                _buildTaskList(dueSoonTasks, theme),
                _buildTaskList(overdueTasks, theme),
              ],
      ),
      floatingActionButton: AuthService.hasPermission('manageTasks')
          ? FloatingActionButton(
              onPressed: () => Navigator.pushNamed(context, '/assign-task'),
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  Widget _buildTaskList(List<ErpTask> taskList, ThemeData theme) {
    if (taskList.isEmpty) {
      return const Center(child: Text('No tasks found in this category.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: taskList.length,
      itemBuilder: (context, index) {
        final task = taskList[index];
        final isOverdue = task.isOverdue;

        Color priorityColor = Colors.green;
        if (task.priority == TaskPriority.high) priorityColor = Colors.orange;
        if (task.priority == TaskPriority.urgent) priorityColor = Colors.red;

        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Priority tag
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: priorityColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        task.priority.displayName.toUpperCase(),
                        style: TextStyle(
                          color: priorityColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                    ),

                    // Overdue / Status tags
                    Row(
                      children: [
                        if (isOverdue)
                          const Chip(
                            label: Text(
                              'OVERDUE',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            backgroundColor: Colors.red,
                            visualDensity: VisualDensity.compact,
                          ),
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: task.status == TaskStatus.completed
                                ? Colors.green.shade50
                                : Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            task.status.displayName,
                            style: TextStyle(
                              color: task.status == TaskStatus.completed
                                  ? Colors.green.shade700
                                  : Colors.blue.shade700,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                Text(
                  task.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  task.description,
                  style: const TextStyle(color: Colors.black54),
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    const Icon(
                      Icons.person_outline,
                      size: 14,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Assigned to: ${task.assignedToName}',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Icon(
                      Icons.calendar_today,
                      size: 14,
                      color: isOverdue ? Colors.red : Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Due: ${task.dueDate.toString().split(' ')[0]}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: isOverdue
                            ? FontWeight.bold
                            : FontWeight.normal,
                        color: isOverdue ? Colors.red : Colors.black87,
                      ),
                    ),
                    const Spacer(),

                    if (AuthService.hasPermission('manageTasks'))
                      PopupMenuButton<String>(
                        onSelected: (value) => value == 'edit'
                            ? _editTask(task)
                            : value == 'status'
                            ? _updateStatus(task)
                            : _deleteTask(task),
                        itemBuilder: (_) => const [
                          PopupMenuItem(value: 'edit', child: Text('Edit')),
                          PopupMenuItem(
                            value: 'status',
                            child: Text('Change status'),
                          ),
                          PopupMenuItem(value: 'delete', child: Text('Delete')),
                        ],
                      )
                    else
                      OutlinedButton.icon(
                        onPressed: task.status == TaskStatus.completed
                            ? null
                            : () => _finishTask(task),
                        icon: Icon(Icons.done_all, size: 14),
                        label: const Text(
                          'Finished',
                          style: TextStyle(fontSize: 11),
                        ),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 0,
                          ),
                          minimumSize: const Size(80, 32),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
