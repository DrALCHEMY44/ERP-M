import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/app_drawer.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'content': 'Hello! I am your SmartERP AI. I am contextually aware of your active business tenant data, stock records, and Cameroon local business rules. Ask me anything!'
    }
  ];
  final _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isReplying = false;

  final List<String> _suggestionPills = [
    'Financial Health Check',
    'Low Stock Items',
    'Cameroon VAT Rate',
    'OHADA Accounting Rules',
  ];

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage([String? text]) async {
    final String query = text ?? _messageController.text;
    if (query.trim().isEmpty) return;

    if (text == null) {
      _messageController.clear();
    }

    setState(() {
      _messages.add({'role': 'user', 'content': query});
      _isReplying = true;
    });
    _scrollToBottom();

    // Call the live AI model simulation in ErpProvider
    final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    final String response = await core.askAi(query);

    if (mounted) {
      setState(() {
        _messages.add({'role': 'assistant', 'content': response});
        _isReplying = false;
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartERP AI Assistant'),
      ),
      drawer: const AppDrawer(currentRoute: '/ai-assistant'),
      body: Column(
        children: [
          // Banner introducing AI assistant
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
            child: Row(
              children: [
                Icon(Icons.psychology, color: theme.colorScheme.primary),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Powered by Genkit & Gemini. Context is automatically populated for your tenant ID.',
                    style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),

          // Message history list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    decoration: BoxDecoration(
                      color: isUser
                          ? theme.colorScheme.primary
                          : theme.colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(16).copyWith(
                        bottomRight: isUser ? const Radius.circular(0) : const Radius.circular(16),
                        bottomLeft: isUser ? const Radius.circular(16) : const Radius.circular(0),
                      ),
                      border: isUser 
                          ? null 
                          : Border.all(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isUser ? 'You' : 'SmartERP AI',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                            color: isUser
                                ? theme.colorScheme.onPrimary.withValues(alpha: 0.7)
                                : theme.colorScheme.primary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Rich Text rendering with simple markdown support
                        _renderMessageContent(msg['content']!, isUser, theme),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Thinking / Generating loader indicator
          if (_isReplying)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'SmartERP AI is analyzing tenant database registers...',
                    style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey),
                  ),
                ],
              ),
            ),

          // Suggestion pills row
          if (!_isReplying)
            Container(
              height: 44,
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _suggestionPills.length,
                itemBuilder: (context, index) {
                  final pillText = _suggestionPills[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ActionChip(
                      label: Text(pillText, style: const TextStyle(fontSize: 12)),
                      onPressed: () => _sendMessage(pillText),
                      backgroundColor: theme.colorScheme.surface,
                    ),
                  );
                },
              ),
            ),

          // Input text row
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Ask AI about inventory, sales, VAT...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  onPressed: () => _sendMessage(),
                  icon: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _renderMessageContent(String text, bool isUser, ThemeData theme) {
    final style = TextStyle(
      color: isUser ? theme.colorScheme.onPrimary : theme.colorScheme.onSurfaceVariant,
      fontSize: 14,
      height: 1.3,
    );

    // Basic markdown parsing for bullet points
    if (text.contains('•') || text.contains('\n')) {
      final List<String> lines = text.split('\n');
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: lines.map((line) {
          if (line.trim().startsWith('•')) {
            return Padding(
              padding: const EdgeInsets.only(left: 8.0, top: 2.0),
              child: Text(line, style: style),
            );
          }
          if (line.trim().startsWith('###')) {
            return Padding(
              padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
              child: Text(
                line.replaceAll('###', '').trim(),
                style: style.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            );
          }
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 1.0),
            child: Text(line, style: style),
          );
        }).toList(),
      );
    }

    return Text(text, style: style);
  }
}
