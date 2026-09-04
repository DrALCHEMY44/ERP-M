import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/inventory_item.dart';
import '../models/sale.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../services/auth_service.dart';
import '../services/data_api.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';
import 'barcode_scanner_screen.dart';

class SalesScreen extends StatefulWidget {
  const SalesScreen({super.key});

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  void _message(String text, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), backgroundColor: error ? Colors.red : null),
    );
  }

  Future<void> _scanForSale() async {
    final barcode = await Navigator.of(context).push<String>(
      MaterialPageRoute(
        builder: (_) =>
            const BarcodeScannerScreen(title: 'Scan product to sell'),
      ),
    );
    if (!mounted || barcode == null) return;
    try {
      final match = await context.read<InventoryProvider>().lookupBarcode(
        barcode,
      );
      if (match == null) {
        _message(
          'This barcode is not registered in the business inventory.',
          error: true,
        );
        return;
      }
      await _showSaleDialog(scanned: match);
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _showSaleDialog({BarcodeProductMatch? scanned}) async {
    final inventory = context.read<InventoryProvider>();
    final transactionProvider = context.read<TransactionProvider>();
    final coreProvider = context.read<CoreProvider>();
    final products = inventory.inventory
        .where((product) => product.stockLevel > 0)
        .toList();
    if (products.isEmpty) {
      _message('No in-stock products are available to sell.', error: true);
      return;
    }
    List<Map<String, dynamic>> customers = const [];
    try {
      final data = await DataApi.operation('listSaleCustomersByBusiness');
      customers = (data['customers'] as List<dynamic>? ?? const [])
          .cast<Map<String, dynamic>>();
    } catch (_) {}
    if (!mounted) return;

    final cart = <_CartLine>[];
    var selectedProductId = scanned?.product.id ?? products.first.id;
    var selectedUnitId =
        scanned?.unit.id ?? products.first.baseUnitDefinition.id;
    final quantity = TextEditingController(text: '1');
    var payment = 'CASH';
    String? customerId;
    if (scanned != null) cart.add(_CartLine(scanned.product, scanned.unit, 1));

    final submit = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) {
          final product = products.firstWhere(
            (item) => item.id == selectedProductId,
          );
          final units = product.units.isEmpty
              ? [product.baseUnitDefinition]
              : product.units;
          if (!units.any((unit) => unit.id == selectedUnitId)) {
            selectedUnitId = product.baseUnitDefinition.id;
          }
          final unit = units.firstWhere(
            (item) => item.id == selectedUnitId,
            orElse: () => product.baseUnitDefinition,
          );
          final available = product.stockLevel ~/ unit.conversionFactor;
          final total = cart.fold<double>(0, (sum, line) => sum + line.total);
          return Padding(
            padding: EdgeInsets.fromLTRB(
              20,
              18,
              20,
              MediaQuery.of(context).viewInsets.bottom + 20,
            ),
            child: SizedBox(
              height: MediaQuery.of(context).size.height * .82,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'New sale',
                          style: Theme.of(context).textTheme.titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(sheetContext, false),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: ListView(
                      children: [
                        DropdownButtonFormField<String>(
                          initialValue: selectedProductId,
                          decoration: const InputDecoration(
                            labelText: 'Product',
                          ),
                          items: products
                              .map(
                                (item) => DropdownMenuItem(
                                  value: item.id,
                                  child: Text(item.name),
                                ),
                              )
                              .toList(),
                          onChanged: (value) => setSheetState(() {
                            selectedProductId = value ?? products.first.id;
                            selectedUnitId = products
                                .firstWhere(
                                  (item) => item.id == selectedProductId,
                                )
                                .baseUnitDefinition
                                .id;
                          }),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                key: ValueKey(
                                  '$selectedProductId:$selectedUnitId',
                                ),
                                initialValue: selectedUnitId,
                                decoration: const InputDecoration(
                                  labelText: 'Selling unit',
                                ),
                                items: units
                                    .map(
                                      (item) => DropdownMenuItem(
                                        value: item.id,
                                        child: Text(
                                          '${item.unitName} (×${item.conversionFactor})',
                                        ),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (value) => setSheetState(
                                  () => selectedUnitId = value ?? unit.id,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            SizedBox(
                              width: 110,
                              child: TextField(
                                controller: quantity,
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  labelText: 'Qty',
                                  helperText: '$available max',
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        OutlinedButton.icon(
                          onPressed: () {
                            final count = int.tryParse(quantity.text) ?? 0;
                            final already = cart
                                .where((line) => line.product.id == product.id)
                                .fold<int>(
                                  0,
                                  (sum, line) => sum + line.baseQuantity,
                                );
                            if (count <= 0 ||
                                already + count * unit.conversionFactor >
                                    product.stockLevel) {
                              ScaffoldMessenger.of(sheetContext).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Enter a valid quantity within available stock.',
                                  ),
                                ),
                              );
                              return;
                            }
                            setSheetState(() {
                              final existing = cart.indexWhere(
                                (line) =>
                                    line.product.id == product.id &&
                                    line.unit.id == unit.id,
                              );
                              if (existing >= 0) {
                                cart[existing] = _CartLine(
                                  product,
                                  unit,
                                  cart[existing].quantity + count,
                                );
                              } else {
                                cart.add(_CartLine(product, unit, count));
                              }
                              quantity.text = '1';
                            });
                          },
                          icon: const Icon(Icons.add_shopping_cart),
                          label: const Text('Add line'),
                        ),
                        const Divider(height: 28),
                        if (cart.isEmpty)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(20),
                              child: Text('Add at least one product.'),
                            ),
                          )
                        else
                          ...cart.asMap().entries.map((entry) {
                            final line = entry.value;
                            return Card(
                              child: ListTile(
                                title: Text(line.product.name),
                                subtitle: Text(
                                  '${line.quantity} ${line.unit.unitName} × FCFA ${line.unitPrice.toStringAsFixed(0)}',
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'FCFA ${line.total.toStringAsFixed(0)}',
                                    ),
                                    IconButton(
                                      onPressed: () => setSheetState(
                                        () => cart.removeAt(entry.key),
                                      ),
                                      icon: const Icon(Icons.close),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                        const Divider(height: 28),
                        DropdownButtonFormField<String>(
                          initialValue: payment,
                          decoration: const InputDecoration(
                            labelText: 'Payment method',
                          ),
                          items:
                              const {
                                    'CASH': 'Cash',
                                    'MOBILE_MONEY': 'Mobile Money',
                                    'BANK_TRANSFER': 'Bank transfer',
                                    'CREDIT': 'Credit',
                                  }.entries
                                  .map(
                                    (entry) => DropdownMenuItem(
                                      value: entry.key,
                                      child: Text(entry.value),
                                    ),
                                  )
                                  .toList(),
                          onChanged: (value) =>
                              setSheetState(() => payment = value ?? 'CASH'),
                        ),
                        const SizedBox(height: 10),
                        DropdownButtonFormField<String?>(
                          initialValue: customerId,
                          decoration: const InputDecoration(
                            labelText: 'Customer (optional)',
                          ),
                          items: [
                            const DropdownMenuItem<String?>(
                              value: null,
                              child: Text('Walk-in customer'),
                            ),
                            ...customers.map(
                              (item) => DropdownMenuItem<String?>(
                                value: item['id']?.toString(),
                                child: Text(
                                  item['customerName']?.toString() ??
                                      'Customer',
                                ),
                              ),
                            ),
                          ],
                          onChanged: (value) =>
                              setSheetState(() => customerId = value),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Total',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      Text(
                        'FCFA ${total.toStringAsFixed(0)}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  FilledButton.icon(
                    onPressed: cart.isEmpty
                        ? null
                        : () => Navigator.pop(sheetContext, true),
                    icon: const Icon(Icons.point_of_sale),
                    label: const Text('Record sale'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
    if (!mounted) return;
    if (submit == true) {
      try {
        final success = await transactionProvider.recordSaleItems(
          cart
              .map(
                (line) => {
                  'productId': line.product.id,
                  'unitId': line.unit.id,
                  'quantity': line.quantity,
                },
              )
              .toList(),
          coreProvider,
          inventory,
          paymentMethod: payment,
          customerId: customerId,
        );
        _message(
          success
              ? 'Sale recorded and inventory updated.'
              : 'You are not allowed to record sales.',
          error: !success,
        );
      } catch (error) {
        _message(error.toString(), error: true);
      }
    }
    quantity.dispose();
  }

  void _showReceipt(Sale sale) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Sale receipt'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Sale ${sale.id}'),
              Text('${sale.date.toLocal()} • ${sale.paymentMethod}'),
              const Divider(),
              ...sale.items.map<Widget>(
                (line) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(line.productName),
                  subtitle: Text(
                    '${line.quantity} ${line.unitName ?? ''} × '
                    'FCFA ${line.priceAtSale.toStringAsFixed(0)}',
                  ),
                  trailing: Text(
                    'FCFA ${(line.quantity * line.priceAtSale).toStringAsFixed(0)}',
                  ),
                ),
              ),
              const Divider(),
              Text(
                'Total: FCFA ${sale.totalAmount.toStringAsFixed(0)}',
                textAlign: TextAlign.right,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
            ],
          ),
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Future<void> _export(List<Sale> sales) async {
    await ExportService.saveCsv('smarterp_sales.csv', [
      [
        'Sale ID',
        'Date',
        'Products',
        'Quantity',
        'Payment',
        'Amount',
        'Recorded by',
      ],
      ...sales.map(
        (sale) => [
          sale.id,
          sale.date.toIso8601String(),
          sale.itemName,
          sale.quantity,
          sale.paymentMethod,
          sale.totalAmount,
          sale.recordedBy,
        ],
      ),
    ]);
    _message('Sales export saved.');
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TransactionProvider>();
    final canSell = AuthService.hasPermission('manageSales');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sales'),
        actions: [
          IconButton(
            onPressed: () => _export(provider.sales),
            icon: const Icon(Icons.download_outlined),
          ),
          if (canSell)
            IconButton(
              onPressed: _scanForSale,
              icon: const Icon(Icons.qr_code_scanner),
            ),
          IconButton(
            onPressed: provider.loadData,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/sales'),
      body: provider.sales.isEmpty
          ? const Center(child: Text('No sales recorded yet.'))
          : RefreshIndicator(
              onRefresh: provider.loadData,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: provider.sales.length,
                itemBuilder: (context, index) {
                  final sale = provider.sales[index];
                  return Card(
                    child: ListTile(
                      leading: const CircleAvatar(
                        child: Icon(Icons.receipt_long_outlined),
                      ),
                      title: Text(
                        sale.itemName,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: Text(
                        '${sale.paymentMethod} • ${sale.date.toLocal().toString().split('.').first}',
                      ),
                      trailing: Text(
                        'FCFA ${sale.totalAmount.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      onTap: () => _showReceipt(sale),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: canSell
          ? FloatingActionButton.extended(
              onPressed: _showSaleDialog,
              icon: const Icon(Icons.add_shopping_cart),
              label: const Text('New sale'),
            )
          : null,
    );
  }
}

class _CartLine {
  final InventoryItem product;
  final ProductUnit unit;
  final int quantity;
  const _CartLine(this.product, this.unit, this.quantity);
  int get baseQuantity => quantity * unit.conversionFactor;
  double get unitPrice =>
      unit.sellingPrice ?? product.price * unit.conversionFactor;
  double get total => quantity * unitPrice;
}
