import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/sale.dart';
import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';
import '../services/auth_service.dart';
import '../widgets/app_drawer.dart';

class SalesScreen extends StatefulWidget {
  const SalesScreen({super.key});

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  final _qtyController = TextEditingController();
  String? _selectedProductId;

  void _showAddSaleDialog() {
    final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    final products = inventory.inventory;

    if (products.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No products in inventory to sell. Please add products first.')),
      );
      return;
    }

    _selectedProductId = products.first.id;
    _qtyController.text = '1';
    double currentPrice = products.first.price;
    int maxStock = products.first.stockLevel;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final theme = Theme.of(context);
        return StatefulBuilder(
          builder: (context, setModalState) {
            final activeProduct = products.firstWhere((p) => p.id == _selectedProductId);
            currentPrice = activeProduct.price;
            maxStock = activeProduct.stockLevel;
            final int quantity = int.tryParse(_qtyController.text) ?? 0;
            final double calculatedTotal = currentPrice * quantity;

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 20, right: 20, top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Record New Sale',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  
                  // Product Dropdown Selection
                  DropdownButtonFormField<String>(
                    value: _selectedProductId,
                    decoration: const InputDecoration(labelText: 'Select Product', border: OutlineInputBorder()),
                    items: products.map((p) => DropdownMenuItem(
                      value: p.id,
                      child: Text('${p.name} (Stock: ${p.stockLevel} ${p.unit})'),
                    )).toList(),
                    onChanged: (val) {
                      setModalState(() {
                        _selectedProductId = val;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Quantity
                  TextField(
                    controller: _qtyController,
                    decoration: InputDecoration(
                      labelText: 'Quantity',
                      helperText: 'Available stock: $maxStock',
                      border: const OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (v) {
                      setModalState(() {});
                    },
                  ),
                  const SizedBox(height: 20),

                  // Receipt Simulator details
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Unit Price:'),
                            Text('FCFA ${currentPrice.toInt()}'),
                          ],
                        ),
                        const Divider(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total Amount:', style: TextStyle(fontWeight: FontWeight.bold)),
                            Text(
                              'FCFA ${calculatedTotal.toInt()}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: theme.colorScheme.primary,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  FilledButton(
                    onPressed: () async {
                      final targetQty = int.tryParse(_qtyController.text) ?? 0;
                      if (targetQty <= 0) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Please enter a valid quantity.')),
                        );
                        return;
                      }

                      final success = await transaction.recordSale(_selectedProductId!, targetQty, core, inventory);
                      
                      if (context.mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(success ? 'Sale recorded successfully!' : 'Record Sale Failed. Check permissions or stock levels.'),
                            backgroundColor: success ? Colors.green : Colors.red,
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      }
                    },
                    child: const Text('Confirm Sale'),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final taskProvider = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final salesList = transaction.sales;

    return Scaffold(
      appBar: AppBar(title: const Text('Sales Log')),
      drawer: const AppDrawer(currentRoute: '/sales'),
      body: salesList.isEmpty
          ? const Center(
              child: Text('No sales transactions recorded yet.'),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: salesList.length,
              itemBuilder: (context, index) {
                final sale = salesList[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.green.shade100,
                      child: const Icon(Icons.receipt_long, color: Colors.green),
                    ),
                    title: Text(
                      sale.itemName,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Qty: ${sale.quantity} • Recorded by ${sale.recordedBy}'),
                        Text(
                          'Date: ${sale.date.toString().split('.')[0]}',
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                    trailing: Text(
                      'FCFA ${sale.totalAmount.toInt()}',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.green.shade800,
                      ),
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: AuthService.hasPermission('manageSales')
          ? FloatingActionButton(
              onPressed: _showAddSaleDialog,
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              child: const Icon(Icons.add_shopping_cart),
            )
          : null,
    );
  }
}
