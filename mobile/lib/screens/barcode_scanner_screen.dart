import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class BarcodeScannerScreen extends StatefulWidget {
  final String title;

  const BarcodeScannerScreen({super.key, this.title = 'Scan barcode'});

  @override
  State<BarcodeScannerScreen> createState() => _BarcodeScannerScreenState();
}

class _BarcodeScannerScreenState extends State<BarcodeScannerScreen> {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
    formats: const [
      BarcodeFormat.ean13,
      BarcodeFormat.ean8,
      BarcodeFormat.upcA,
      BarcodeFormat.upcE,
      BarcodeFormat.code128,
      BarcodeFormat.code39,
      BarcodeFormat.dataMatrix,
      BarcodeFormat.qrCode,
    ],
  );
  bool _completed = false;

  Future<void> _complete(String? rawValue) async {
    final value = rawValue?.trim();
    if (_completed || value == null || value.isEmpty) return;
    _completed = true;
    await _controller.stop();
    if (mounted) Navigator.of(context).pop(value);
  }

  Future<void> _enterManually() async {
    final field = TextEditingController();
    final value = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Enter barcode'),
        content: TextField(
          controller: field,
          autofocus: true,
          keyboardType: TextInputType.text,
          textInputAction: TextInputAction.done,
          decoration: const InputDecoration(
            labelText: 'Barcode number',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (value) {
            if (value.trim().isNotEmpty) Navigator.pop(context, value.trim());
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              if (field.text.trim().isNotEmpty) {
                Navigator.pop(context, field.text.trim());
              }
            },
            child: const Text('Use code'),
          ),
        ],
      ),
    );
    field.dispose();
    if (value != null) await _complete(value);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.title),
        foregroundColor: Colors.white,
        backgroundColor: Colors.black,
        actions: [
          IconButton(
            tooltip: 'Torch',
            onPressed: _controller.toggleTorch,
            icon: const Icon(Icons.flashlight_on_outlined),
          ),
          IconButton(
            tooltip: 'Switch camera',
            onPressed: _controller.switchCamera,
            icon: const Icon(Icons.cameraswitch_outlined),
          ),
        ],
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: (capture) {
              if (capture.barcodes.isNotEmpty) {
                _complete(capture.barcodes.first.rawValue);
              }
            },
          ),
          IgnorePointer(
            child: Center(
              child: Container(
                width: 290,
                height: 170,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.greenAccent, width: 3),
                  borderRadius: BorderRadius.circular(18),
                ),
              ),
            ),
          ),
          Positioned(
            left: 24,
            right: 24,
            bottom: 40,
            child: Column(
              children: [
                const Text(
                  'Place the product barcode inside the frame',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 14),
                OutlinedButton.icon(
                  onPressed: _enterManually,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white70),
                  ),
                  icon: const Icon(Icons.keyboard_alt_outlined),
                  label: const Text('Enter code manually'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
