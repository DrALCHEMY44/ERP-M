import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/inventory_item.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../services/auth_service.dart';
import '../services/export_service.dart';
import '../widgets/app_drawer.dart';
import 'barcode_scanner_screen.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  static const _baseUnits = ['piece', 'bottle', 'kilogram', 'liter', 'meter'];
  static const _scanUnits = [
    'piece',
    'bottle',
    'pack',
    'box',
    'carton',
    'bag',
    'kilogram',
    'liter',
    'meter',
    'roll',
  ];

  final _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      if (mounted) {
        setState(() => _searchQuery = _searchController.text.toLowerCase());
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _message(String text, {bool error = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        backgroundColor: error ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _scanForStock() async {
    final barcode = await Navigator.of(context).push<String>(
      MaterialPageRoute(
        builder: (_) => const BarcodeScannerScreen(title: 'Receive stock'),
      ),
    );
    if (!mounted || barcode == null) return;
    try {
      final match = await context.read<InventoryProvider>().lookupBarcode(
        barcode,
      );
      if (!mounted) return;
      if (match == null) {
        _message(
          'Barcode not registered. Create the product to link it.',
          error: true,
        );
        await _showAddProductDialog(initialBarcode: barcode);
        return;
      }
      await _showReceiveDialog(barcode, match);
    } catch (error) {
      _message(error.toString().replaceFirst('Exception: ', ''), error: true);
    }
  }

  Future<void> _showReceiveDialog(
    String barcode,
    BarcodeProductMatch match,
  ) async {
    final quantity = TextEditingController(text: '1');
    final formKey = GlobalKey<FormState>();
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Receive scanned stock'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                match.product.name,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 6),
              Text(
                '1 ${match.unit.unitName} = '
                '${match.unit.conversionFactor} ${match.product.unit}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: quantity,
                autofocus: true,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Number of ${match.unit.unitName}s received',
                  border: const OutlineInputBorder(),
                ),
                validator: (value) {
                  final parsed = int.tryParse(value ?? '');
                  return parsed == null || parsed <= 0
                      ? 'Enter a positive whole number'
                      : null;
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              if (!formKey.currentState!.validate()) return;
              try {
                final count = int.parse(quantity.text);
                final added = await context
                    .read<InventoryProvider>()
                    .receiveByBarcode(barcode, count);
                if (!dialogContext.mounted) return;
                Navigator.pop(dialogContext);
                _message(
                  'Received $count ${match.unit.unitName}(s): '
                  '$added ${match.product.unit} added.',
                );
              } catch (error) {
                if (dialogContext.mounted) {
                  ScaffoldMessenger.of(dialogContext).showSnackBar(
                    SnackBar(
                      content: Text(
                        error.toString().replaceFirst('Exception: ', ''),
                      ),
                    ),
                  );
                }
              }
            },
            child: const Text('Add to stock'),
          ),
        ],
      ),
    );
    quantity.dispose();
  }

  Future<void> _showAddProductDialog({String initialBarcode = ''}) async {
    final name = TextEditingController();
    final category = TextEditingController(text: 'Food');
    final stock = TextEditingController(text: '0');
    final cost = TextEditingController();
    final price = TextEditingController();
    final threshold = TextEditingController(text: '10');
    final barcode = TextEditingController(text: initialBarcode);
    final factor = TextEditingController(text: '1');
    final packagePrice = TextEditingController();
    final formKey = GlobalKey<FormState>();
    var baseUnit = 'piece';
    var scanUnit = 'piece';

    await showDialog<void>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(
            initialBarcode.isEmpty
                ? 'Add inventory product'
                : 'Register scanned product',
          ),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: name,
                    decoration: const InputDecoration(
                      labelText: 'Product name',
                    ),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Name is required'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: category.text,
                    decoration: const InputDecoration(labelText: 'Category'),
                    items:
                        [
                              'Food',
                              'Cleaning',
                              'Beverages',
                              'Utilities',
                              'Services',
                              'General',
                            ]
                            .map(
                              (value) => DropdownMenuItem(
                                value: value,
                                child: Text(value),
                              ),
                            )
                            .toList(),
                    onChanged: (value) => category.text = value ?? 'General',
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: baseUnit,
                    decoration: const InputDecoration(
                      labelText: 'Base stock unit',
                    ),
                    items: _baseUnits
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => setDialogState(() {
                      baseUnit = value ?? 'piece';
                    }),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: stock,
                    decoration: InputDecoration(
                      labelText: 'Opening stock (in $baseUnit)',
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      final parsed = int.tryParse(value ?? '');
                      return parsed == null || parsed < 0
                          ? 'Enter zero or more'
                          : null;
                    },
                  ),
                  const Divider(height: 28),
                  TextFormField(
                    controller: barcode,
                    decoration: const InputDecoration(
                      labelText: 'Barcode (optional)',
                      prefixIcon: Icon(Icons.qr_code_2),
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: scanUnit,
                    decoration: const InputDecoration(
                      labelText: 'Unit represented by barcode',
                    ),
                    items: _scanUnits
                        .map(
                          (value) => DropdownMenuItem(
                            value: value,
                            child: Text(value),
                          ),
                        )
                        .toList(),
                    onChanged: (value) => setDialogState(() {
                      scanUnit = value ?? baseUnit;
                      if (scanUnit == baseUnit) factor.text = '1';
                    }),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: factor,
                    enabled: scanUnit != baseUnit,
                    decoration: InputDecoration(
                      labelText: '$baseUnit units in one $scanUnit',
                      helperText: 'Example: one carton may contain 24 bottles.',
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      final parsed = int.tryParse(value ?? '');
                      return parsed == null || parsed <= 0
                          ? 'Enter at least 1'
                          : null;
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: cost,
                          decoration: InputDecoration(
                            labelText: 'Cost / $baseUnit',
                          ),
                          keyboardType: TextInputType.number,
                          validator: _validPrice,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextFormField(
                          controller: price,
                          decoration: InputDecoration(
                            labelText: 'Sale / $baseUnit',
                          ),
                          keyboardType: TextInputType.number,
                          validator: _validPrice,
                        ),
                      ),
                    ],
                  ),
                  if (scanUnit != baseUnit) ...[
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: packagePrice,
                      decoration: InputDecoration(
                        labelText: 'Sale price per $scanUnit (optional)',
                        helperText: 'Leave empty to multiply the base price.',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ],
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: threshold,
                    decoration: InputDecoration(
                      labelText: 'Low-stock alert (in $baseUnit)',
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      final parsed = int.tryParse(value ?? '');
                      return parsed == null || parsed < 0
                          ? 'Enter zero or more'
                          : null;
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                if (!formKey.currentState!.validate()) return;
                try {
                  final success = await context
                      .read<InventoryProvider>()
                      .addProduct(
                        name.text.trim(),
                        category.text,
                        int.parse(stock.text),
                        baseUnit,
                        double.parse(cost.text),
                        double.parse(price.text),
                        int.parse(threshold.text),
                        context.read<CoreProvider>(),
                        barcode: barcode.text.trim().isEmpty
                            ? null
                            : barcode.text.trim(),
                        scanUnit: scanUnit,
                        conversionFactor: scanUnit == baseUnit
                            ? 1
                            : int.parse(factor.text),
                        scanSellingPrice: packagePrice.text.trim().isEmpty
                            ? null
                            : double.tryParse(packagePrice.text),
                      );
                  if (!dialogContext.mounted) return;
                  Navigator.pop(dialogContext);
                  _message(
                    success
                        ? 'Product added successfully.'
                        : 'You are not allowed to add products.',
                    error: !success,
                  );
                } catch (error) {
                  if (dialogContext.mounted) {
                    ScaffoldMessenger.of(dialogContext).showSnackBar(
                      SnackBar(
                        content: Text(
                          error.toString().replaceFirst('Exception: ', ''),
                        ),
                      ),
                    );
                  }
                }
              },
              child: const Text('Save product'),
            ),
          ],
        ),
      ),
    );

    for (final controller in [
      name,
      category,
      stock,
      cost,
      price,
      threshold,
      barcode,
      factor,
      packagePrice,
    ]) {
      controller.dispose();
    }
  }

  static String? _validPrice(String? value) {
    final parsed = double.tryParse(value ?? '');
    return parsed == null || parsed < 0 ? 'Invalid price' : null;
  }

  Future<void> _editProduct(InventoryItem item) async {
    final inventoryProvider = context.read<InventoryProvider>();
    final name = TextEditingController(text: item.name);
    final category = TextEditingController(text: item.category);
    final quantity = TextEditingController(text: item.stockLevel.toString());
    final cost = TextEditingController(text: item.costPrice.toString());
    final price = TextEditingController(text: item.price.toString());
    final threshold = TextEditingController(
      text: item.lowStockLevel.toString(),
    );
    final formKey = GlobalKey<FormState>();
    final save = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Edit product'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: name,
                  decoration: const InputDecoration(labelText: 'Product name'),
                  validator: (value) =>
                      value == null || value.trim().isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: category,
                  decoration: const InputDecoration(labelText: 'Category'),
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: quantity,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Stock (${item.unit})',
                  ),
                  validator: (value) => int.tryParse(value ?? '') == null
                      ? 'Enter a whole number'
                      : null,
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: cost,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Cost price'),
                  validator: _validPrice,
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: price,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Selling price'),
                  validator: _validPrice,
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: threshold,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Low-stock threshold',
                  ),
                  validator: (value) => int.tryParse(value ?? '') == null
                      ? 'Enter a whole number'
                      : null,
                ),
                const SizedBox(height: 10),
                Text(
                  'Barcode units are adjusted through scan receiving and remain linked to this product.',
                  style: Theme.of(context).textTheme.bodySmall,
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
            onPressed: () {
              if (formKey.currentState!.validate()) {
                Navigator.pop(dialogContext, true);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (!mounted) return;
    if (save == true) {
      try {
        await inventoryProvider.updateProduct(item.id, {
          'name': name.text.trim(),
          'category': category.text.trim(),
          'quantity': int.parse(quantity.text),
          'costPrice': double.parse(cost.text),
          'sellingPrice': double.parse(price.text),
          'lowStockLevel': int.parse(threshold.text),
        });
        _message('Product updated.');
      } catch (error) {
        _message(error.toString(), error: true);
      }
    }
    for (final controller in [
      name,
      category,
      quantity,
      cost,
      price,
      threshold,
    ]) {
      controller.dispose();
    }
  }

  Future<void> _deleteProduct(InventoryItem item) async {
    final inventoryProvider = context.read<InventoryProvider>();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete product?'),
        content: Text(
          'Delete “${item.name}”? Products referenced by sales may be protected.',
        ),
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
    if (confirmed != true) return;
    try {
      await inventoryProvider.deleteProduct(item.id);
      _message('Product deleted.');
    } catch (error) {
      _message(error.toString(), error: true);
    }
  }

  Future<void> _export(List<InventoryItem> items) async {
    await ExportService.saveCsv('smarterp_inventory.csv', [
      [
        'Product',
        'Category',
        'Stock',
        'Base unit',
        'Cost price',
        'Selling price',
        'Low stock threshold',
        'Barcode',
      ],
      ...items.map(
        (item) => [
          item.name,
          item.category,
          item.stockLevel,
          item.unit,
          item.costPrice,
          item.price,
          item.lowStockLevel,
          item.barcode,
        ],
      ),
    ]);
    _message('Inventory export saved.');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final inventory = context.watch<InventoryProvider>();
    final categories = [
      'All',
      ...inventory.inventory.map((item) => item.category).toSet(),
    ];
    final items = inventory.inventory.where((item) {
      final matchesSearch =
          item.name.toLowerCase().contains(_searchQuery) ||
          item.category.toLowerCase().contains(_searchQuery) ||
          (item.barcode?.toLowerCase().contains(_searchQuery) ?? false);
      return matchesSearch &&
          (_selectedCategory == 'All' || item.category == _selectedCategory);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory Registry'),
        actions: [
          IconButton(
            tooltip: 'Export inventory',
            onPressed: () => _export(inventory.inventory),
            icon: const Icon(Icons.download_outlined),
          ),
          if (AuthService.hasPermission('manageInventory'))
            IconButton(
              tooltip: 'Scan to receive stock',
              onPressed: _scanForStock,
              icon: const Icon(Icons.qr_code_scanner),
            ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: '/inventory'),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    labelText: 'Search products or barcode',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: _searchController.clear,
                          )
                        : null,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: categories.map((category) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(category),
                          selected: category == _selectedCategory,
                          onSelected: (_) =>
                              setState(() => _selectedCategory = category),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: items.isEmpty
                ? Center(
                    child: Text(
                      'No products matching filters.',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: Colors.grey.shade600,
                      ),
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: inventory.loadData,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: items.length,
                      itemBuilder: (context, index) {
                        final item = items[index];
                        final low = item.stockLevel <= item.lowStockLevel;
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            isThreeLine: true,
                            leading: Icon(
                              low
                                  ? Icons.warning_amber_rounded
                                  : Icons.inventory_2_outlined,
                              color: low ? Colors.red : Colors.green,
                            ),
                            title: Text(
                              item.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            subtitle: Text(
                              '${item.category} • '
                              '${item.stockLevel} ${item.unit}\n'
                              'FCFA ${item.price.toInt()} / ${item.unit} • ${item.barcode == null ? 'No barcode' : 'Barcode: ${item.barcode}'}',
                            ),
                            trailing:
                                AuthService.hasPermission('manageInventory')
                                ? PopupMenuButton<String>(
                                    onSelected: (value) => value == 'edit'
                                        ? _editProduct(item)
                                        : _deleteProduct(item),
                                    itemBuilder: (_) => const [
                                      PopupMenuItem(
                                        value: 'edit',
                                        child: Text('Edit'),
                                      ),
                                      PopupMenuItem(
                                        value: 'delete',
                                        child: Text('Delete'),
                                      ),
                                    ],
                                  )
                                : low
                                ? const Text(
                                    'LOW',
                                    style: TextStyle(
                                      color: Colors.red,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  )
                                : null,
                          ),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: AuthService.hasPermission('manageInventory')
          ? FloatingActionButton.extended(
              onPressed: _showAddProductDialog,
              icon: const Icon(Icons.add),
              label: const Text('Add Product'),
            )
          : null,
    );
  }
}
