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

class _TasksListScreenState extends State<TasksListScreen> with SingleTickerProviderStateMixin {
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

  void _updateProgress(ErpTask task) {
    final user = AuthService.currentUser;

    // Security rule: Staff can only update tasks assigned to them
    if (user?.role == UserRole.staff && task.assignedToId != user?.id) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.warning, color: Colors.red),
              SizedBox(width: 8),
              Text('Access Denied'),
            ],
          ),
          content: const Text('You can only update the progress of tasks assigned directly to you.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    double localProgress = task.progress.toDouble();
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text('Update Progress: ${task.title}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Current Progress: ${localProgress.toInt()}%'),
              const SizedBox(height: 12),
              Slider(
                value: localProgress,
                min: 0,
                max: 100,
                divisions: 10,
                label: '${localProgress.toInt()}%',
                onChanged: (val) => setDialogState(() => localProgress = val),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                final core = Provider.of<CoreProvider>(context, listen: false);
                final taskProvider = Provider.of<TaskProvider>(context, listen: false);
                final success = await taskProvider.updateTaskProgress(task.id, localProgress.toInt(), core);
                
                if (context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(success ? 'Progress updated successfully!' : 'Failed: Unauthorized to update this task.'),
                      backgroundColor: success ? Colors.green : Colors.red,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              }, 
              child: const Text('Save')
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _finishTask(ErpTask task) async {
    final core = context.read<CoreProvider>();
    final taskProvider = context.read<TaskProvider>();
    final success = await taskProvider.updateTaskProgress(task.id, 100, core);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(success ? 'Task marked as finished.' : 'Could not finish this task.'),
      backgroundColor: success ? Colors.green : Colors.red,
      behavior: SnackBarBehavior.floating,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final currentUserId = AuthService.currentUser?.id ?? '';
    final isEmployee = AuthService.currentUser?.role == UserRole.staff;

    // Isolated lists based on tab filter
    final allTasks = taskProvider.tasks;
    final myTasks = taskProvider.tasks.where((t) => t.assignedToId == currentUserId).toList();
    
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
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: priorityColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        task.priority.displayName.toUpperCase(),
                        style: TextStyle(color: priorityColor, fontWeight: FontWeight.bold, fontSize: 10),
                      ),
                    ),
                    
                    // Overdue / Status tags
                    Row(
                      children: [
                        if (isOverdue)
                          const Chip(
                            label: Text('OVERDUE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            backgroundColor: Colors.red,
                            visualDensity: VisualDensity.compact,
                          ),
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: task.status == TaskStatus.completed ? Colors.green.shade50 : Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            task.status.displayName,
                            style: TextStyle(
                              color: task.status == TaskStatus.completed ? Colors.green.shade700 : Colors.blue.shade700, 
                              fontWeight: FontWeight.bold, 
                              fontSize: 10
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
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 6),
                Text(task.description, style: const TextStyle(color: Colors.black54)),
                const SizedBox(height: 12),
                
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text('Assigned to: ${task.assignedToName}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    const Spacer(),
                    Text('Progress: ${task.progress}%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 6),
                LinearProgressIndicator(
                  value: task.progress / 100,
                  backgroundColor: Colors.grey.shade200,
                  color: isOverdue ? Colors.red : Colors.blue,
                  borderRadius: BorderRadius.circular(4),
                ),
                const SizedBox(height: 16),
                
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 14, color: isOverdue ? Colors.red : Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      'Due: ${task.dueDate.toString().split(' ')[0]}',
                      style: TextStyle(fontSize: 12, fontWeight: isOverdue ? FontWeight.bold : FontWeight.normal, color: isOverdue ? Colors.red : Colors.black87),
                    ),
                    const Spacer(),
                    
                    OutlinedButton.icon(
                      onPressed: task.status == TaskStatus.completed
                          ? null
                          : () => AuthService.currentUser?.role == UserRole.staff
                              ? _finishTask(task)
                              : _updateProgress(task),
                      icon: Icon(AuthService.currentUser?.role == UserRole.staff ? Icons.done_all : Icons.edit, size: 14),
                      label: Text(
                        AuthService.currentUser?.role == UserRole.staff ? 'Finished' : 'Update Progress',
                        style: const TextStyle(fontSize: 11),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
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
