import 'dart:convert';

import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../widgets/app_drawer.dart';
import 'barcode_scanner_screen.dart';

class WebSaleScannerScreen extends StatefulWidget {
  const WebSaleScannerScreen({super.key});

  @override
  State<WebSaleScannerScreen> createState() => _WebSaleScannerScreenState();
}

class _WebSaleScannerScreenState extends State<WebSaleScannerScreen> {
  String? _token;
  String? _expiresAt;
  String? _lastMessage;
  bool _busy = false;

  Future<void> _scanPairingCode() async {
    final raw = await Navigator.of(context).push<String>(
      MaterialPageRoute(
        builder: (_) =>
            const BarcodeScannerScreen(title: 'Scan web sale QR code'),
      ),
    );
    if (!mounted || raw == null) return;
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map || decoded['type'] != 'smarterp-sale-scanner') {
        throw const FormatException(
          'This is not a SmartERP web-sale pairing code.',
        );
      }
      final token = decoded['token']?.toString().trim() ?? '';
      if (token.length < 32) {
        throw const FormatException('The pairing code is incomplete.');
      }
      setState(() => _busy = true);
      final response = await ApiService.request(
        '/api/sales/scanner',
        method: 'POST',
        body: {'action': 'join', 'token': token},
      );
      if (!mounted) return;
      setState(() {
        _token = token;
        _expiresAt = response['expiresAt']?.toString();
        _lastMessage =
            'Phone paired. You can now scan products for the web sale.';
      });
    } on FormatException catch (error) {
      _showError(error.message);
    } on ApiException catch (error) {
      _showError(error.message);
    } catch (_) {
      _showError('Could not read the pairing code. Try again.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _scanProduct() async {
    final token = _token;
    if (token == null) return;
    final barcode = await Navigator.of(context).push<String>(
      MaterialPageRoute(
        builder: (_) =>
            const BarcodeScannerScreen(title: 'Scan product for web sale'),
      ),
    );
    if (!mounted || barcode == null) return;
    try {
      setState(() => _busy = true);
      final response = await ApiService.request(
        '/api/sales/scanner',
        method: 'POST',
        body: {'action': 'scan', 'token': token, 'barcode': barcode},
      );
      if (!mounted) return;
      setState(() {
        _lastMessage =
            '${response['productName']} · ${response['quantity']} ${response['unitName']} in the web cart';
      });
    } on ApiException catch (error) {
      _showError(error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paired = _token != null;
    return Scaffold(
      appBar: AppBar(title: const Text('Web sale scanner')),
      drawer: const AppDrawer(currentRoute: '/web-sale-scanner'),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Icon(
              paired ? Icons.link_rounded : Icons.qr_code_scanner_rounded,
              size: 48,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              paired ? 'Scanner is paired' : 'Pair with a web sale',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              paired
                  ? 'Every barcode you scan is added to the open cart in the connected web browser.'
                  : 'On the web Sales page, open New Sale and choose Connect phone. Scan the QR code shown there.',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            if (_expiresAt != null) ...[
              const SizedBox(height: 8),
              Text(
                'A temporary scanner session is active.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 28),
            FilledButton.icon(
              onPressed: _busy
                  ? null
                  : (paired ? _scanProduct : _scanPairingCode),
              icon: _busy
                  ? const SizedBox.square(
                      dimension: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Icon(paired ? Icons.barcode_reader : Icons.qr_code_scanner),
              label: Text(
                paired ? 'Scan product barcode' : 'Scan web pairing code',
              ),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(54),
              ),
            ),
            if (paired) ...[
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _busy
                    ? null
                    : () => setState(() {
                        _token = null;
                        _expiresAt = null;
                        _lastMessage =
                            'Phone disconnected. The web cart is unchanged.';
                      }),
                child: const Text('Disconnect this phone'),
              ),
            ],
            if (_lastMessage != null) ...[
              const SizedBox(height: 28),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.info_outline),
                      const SizedBox(width: 12),
                      Expanded(child: Text(_lastMessage!)),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 24),
            const Text(
              'The phone only scans into a temporary, authenticated sale session. The web user still checks the cart, chooses payment, and records the final sale.',
            ),
          ],
        ),
      ),
    );
  }
}
