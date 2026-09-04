import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/data_api.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  List<Map<String, dynamic>> _documents = const [];
  bool _loading = true;
  String? _error;

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
      final data = await DataApi.operation('listDocumentsByBusiness');
      _documents = (data['documents'] as List<dynamic>? ?? const [])
          .cast<Map<String, dynamic>>();
    } catch (error) {
      _error = error.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _upload() async {
    final file = await FilePicker.pickFile();
    if (file == null) return;
    final fileSize = await file.length();
    if (!mounted) return;
    final title = TextEditingController(
      text: file.name.contains('.')
          ? file.name.substring(0, file.name.lastIndexOf('.'))
          : file.name,
    );
    final description = TextEditingController();
    var type = 'Other';
    final submit = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Upload document'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.attach_file),
                  title: Text(file.name),
                  subtitle: Text('${(fileSize / 1024).ceil()} KB'),
                ),
                TextField(
                  controller: title,
                  decoration: const InputDecoration(labelText: 'Title'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: type,
                  decoration: const InputDecoration(labelText: 'Document type'),
                  items:
                      [
                            'Receipt',
                            'Invoice',
                            'Contract',
                            'License',
                            'Report',
                            'Employee',
                            'Supplier',
                            'Other',
                          ]
                          .map(
                            (value) => DropdownMenuItem(
                              value: value,
                              child: Text(value),
                            ),
                          )
                          .toList(),
                  onChanged: (value) =>
                      setDialogState(() => type = value ?? 'Other'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: description,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Description'),
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
              onPressed: () =>
                  Navigator.pop(dialogContext, title.text.trim().isNotEmpty),
              child: const Text('Upload'),
            ),
          ],
        ),
      ),
    );
    if (submit != true) return;
    setState(() => _loading = true);
    String? uploadedUrl;
    try {
      final uploaded = await ApiService.uploadFile(file);
      uploadedUrl = uploaded['fileUrl']?.toString();
      if (uploadedUrl == null) {
        throw const ApiException('Upload URL was missing.');
      }
      final created = await DataApi.operation('CreateDocument', {
        'title': title.text.trim(),
        'documentType': type,
        'fileUrl': uploadedUrl,
        'description': description.text.trim(),
      });
      final row = created['document_insert'] as Map<String, dynamic>?;
      final id = row?['id']?.toString();
      if (id != null) {
        try {
          await ApiService.request(
            '/api/documents/process',
            method: 'POST',
            body: {
              'documentId': id,
              'fileUrl': uploadedUrl,
              'filename': file.name,
            },
          );
        } catch (_) {
          // The source document remains usable when optional AI extraction fails.
        }
      }
      _message('Document uploaded.');
      await _load();
    } catch (error) {
      if (uploadedUrl != null) {
        try {
          await ApiService.deleteManagedFile(uploadedUrl);
        } catch (_) {}
      }
      _message(error.toString(), error: true);
      if (mounted) setState(() => _loading = false);
    } finally {
      title.dispose();
      description.dispose();
    }
  }

  Future<void> _download(Map<String, dynamic> document) async {
    try {
      final file = await ApiService.downloadFile(
        document['fileUrl'].toString(),
      );
      final raw = document['title']?.toString() ?? 'document';
      final filename = raw.replaceAll(RegExp(r'[^A-Za-z0-9._-]'), '_');
      await ExportService.saveBytes(filename, file.bytes);
      _message('Document saved to the selected location.');
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _delete(Map<String, dynamic> document) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete document?'),
        content: Text('“${document['title']}” will be permanently deleted.'),
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
    try {
      await DataApi.operation('DeleteDocument', {'id': document['id']});
      try {
        await ApiService.deleteManagedFile(document['fileUrl'].toString());
      } catch (_) {}
      await _load();
    } catch (error) {
      _message(error.toString(), error: true);
    }
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

  @override
  Widget build(BuildContext context) {
    final canWrite = AuthService.hasPermission('manageDocuments');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Documents'),
        actions: [
          IconButton(onPressed: _load, icon: const Icon(Icons.refresh)),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/documents'),
      floatingActionButton: canWrite
          ? FloatingActionButton.extended(
              onPressed: _upload,
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload'),
            )
          : null,
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
          : _documents.isEmpty
          ? const Center(child: Text('No documents uploaded yet.'))
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _documents.length,
                itemBuilder: (context, index) {
                  final item = _documents[index];
                  return Card(
                    child: ListTile(
                      leading: const CircleAvatar(
                        child: Icon(Icons.description_outlined),
                      ),
                      title: Text(item['title']?.toString() ?? 'Document'),
                      subtitle: Text(
                        '${item['documentType'] ?? 'Other'}\n${item['description'] ?? ''}',
                      ),
                      isThreeLine: true,
                      onTap: () => _download(item),
                      trailing: PopupMenuButton<String>(
                        onSelected: (value) => value == 'download'
                            ? _download(item)
                            : _delete(item),
                        itemBuilder: (_) => [
                          const PopupMenuItem(
                            value: 'download',
                            child: Text('Download'),
                          ),
                          if (canWrite)
                            const PopupMenuItem(
                              value: 'delete',
                              child: Text('Delete'),
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
