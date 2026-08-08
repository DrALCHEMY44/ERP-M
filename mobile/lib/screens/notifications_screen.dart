import 'dart:async';

import 'package:flutter/material.dart';

import '../services/announcement_service.dart';
import '../widgets/app_drawer.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<AnnouncementItem> items = [];
  bool loading = true;
  bool canPublish = false;
  String? error;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    _load();
    timer = Timer.periodic(
      const Duration(seconds: 10),
      (_) => _load(silent: true),
    );
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  Future<void> _load({bool silent = false}) async {
    if (!silent) setState(() => loading = true);
    try {
      final data = await AnnouncementService.list();
      if (mounted) {
        setState(() {
          items = data.items;
          canPublish = data.canPublish;
          error = null;
        });
      }
    } catch (exception) {
      if (mounted) {
        setState(() {
          error = exception.toString().replaceAll('Exception: ', '');
        });
      }
    } finally {
      if (mounted && !silent) setState(() => loading = false);
    }
  }

  Future<void> _compose() async {
    final title = TextEditingController();
    final message = TextEditingController();
    var priority = 'NORMAL';
    final send = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('New announcement'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: title,
                  decoration: const InputDecoration(labelText: 'Title'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: priority,
                  items: const [
                    DropdownMenuItem(value: 'NORMAL', child: Text('Normal')),
                    DropdownMenuItem(
                      value: 'IMPORTANT',
                      child: Text('Important'),
                    ),
                    DropdownMenuItem(value: 'URGENT', child: Text('Urgent')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setDialogState(() => priority = value);
                    }
                  },
                  decoration: const InputDecoration(labelText: 'Priority'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: message,
                  maxLines: 5,
                  decoration: const InputDecoration(labelText: 'Message'),
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
              child: const Text('Publish'),
            ),
          ],
        ),
      ),
    );

    if (send != true ||
        title.text.trim().length < 3 ||
        message.text.trim().length < 3) {
      return;
    }
    try {
      await AnnouncementService.publish(
        title.text.trim(),
        message.text.trim(),
        priority,
      );
      await _load();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Announcement published')),
        );
      }
    } catch (exception) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(exception.toString())),
        );
      }
    } finally {
      title.dispose();
      message.dispose();
    }
  }

  Future<void> _read(AnnouncementItem item) async {
    if (item.isRead) return;
    setState(() {
      items = items
          .map(
            (entry) => entry.id == item.id
                ? entry.copyWith(isRead: true)
                : entry,
          )
          .toList();
    });
    try {
      await AnnouncementService.markRead(item.id);
    } catch (_) {
      await _load(silent: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Announcements',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        actions: [
          IconButton(
            onPressed: _load,
            icon: const Icon(Icons.refresh_rounded),
          ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/notifications'),
      floatingActionButton: canPublish
          ? FloatingActionButton.extended(
              onPressed: _compose,
              icon: const Icon(Icons.campaign_rounded),
              label: const Text('Announce'),
            )
          : null,
      body: RefreshIndicator(onRefresh: _load, child: _content()),
    );
  }

  Widget _content() {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (error != null) {
      return ListView(
        children: [
          const SizedBox(height: 160),
          Icon(Icons.cloud_off_rounded, size: 44, color: Colors.grey.shade400),
          const SizedBox(height: 12),
          Text(error!, textAlign: TextAlign.center),
        ],
      );
    }
    if (items.isEmpty) {
      return ListView(
        children: const [
          SizedBox(height: 180),
          Icon(Icons.notifications_none_rounded, size: 48, color: Colors.grey),
          SizedBox(height: 12),
          Text('No announcements yet', textAlign: TextAlign.center),
        ],
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, index) => _announcementCard(items[index]),
    );
  }

  Widget _announcementCard(AnnouncementItem item) {
    final urgent = item.priority == 'URGENT';
    final important = item.priority == 'IMPORTANT';
    final color = urgent ? Colors.red : (important ? Colors.orange : Colors.blue);
    return Card(
      color: item.isRead ? null : color.withValues(alpha: .06),
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () => _read(item),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                backgroundColor: color.withValues(alpha: .12),
                child: Icon(
                  urgent ? Icons.warning_amber_rounded : Icons.campaign_rounded,
                  color: color,
                ),
              ),
              const SizedBox(width: 13),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                        ),
                        if (!item.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: color,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 7),
                    Text(item.message, style: const TextStyle(height: 1.4)),
                    const SizedBox(height: 10),
                    Text(
                      '${item.createdByName} • ${_ago(item.createdAt)}',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _ago(DateTime date) {
    final difference = DateTime.now().difference(date.toLocal());
    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inHours < 1) return '${difference.inMinutes}m ago';
    if (difference.inDays < 1) return '${difference.inHours}h ago';
    return '${difference.inDays}d ago';
  }
}
