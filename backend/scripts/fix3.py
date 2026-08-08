import os
import re

lib_dir = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\screens"

for filename in os.listdir(lib_dir):
    if not filename.endswith(".dart"): continue
    
    filepath = os.path.join(lib_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "ErpProvider" not in content: continue

    # replace imports
    content = content.replace("import '../providers/erp_provider.dart';", 
"""import '../providers/core_provider.dart';
import '../providers/inventory_provider.dart';
import '../providers/transaction_provider.dart';
import '../providers/task_provider.dart';
import '../providers/theme_provider.dart';""")

    # replace provider retrieval
    content = content.replace("final erp = Provider.of<ErpProvider>(context);",
"""final core = Provider.of<CoreProvider>(context);
    final inventory = Provider.of<InventoryProvider>(context);
    final transaction = Provider.of<TransactionProvider>(context);
    final task = Provider.of<TaskProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);""")

    content = content.replace("final erp = Provider.of<ErpProvider>(context, listen: false);",
"""final core = Provider.of<CoreProvider>(context, listen: false);
    final inventory = Provider.of<InventoryProvider>(context, listen: false);
    final transaction = Provider.of<TransactionProvider>(context, listen: false);
    final task = Provider.of<TaskProvider>(context, listen: false);
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);""")

    # mappings
    content = content.replace("erp.sales", "transaction.sales")
    content = content.replace("erp.expenses", "transaction.expenses")
    
    content = content.replace("erp.inventory", "inventory.inventory")
    content = content.replace("erp.products", "inventory.products")
    
    content = content.replace("erp.tasks", "task.tasks")

    content = content.replace("erp.activityLogs", "core.activityLogs")
    content = content.replace("erp.notifications", "core.notifications")
    content = content.replace("erp.unreadNotifications", "core.unreadNotifications")
    content = content.replace("erp.markAllNotificationsAsRead", "core.markAllNotificationsAsRead")
    content = content.replace("erp.askAi", "core.askAi")
    content = content.replace("erp.themeMode", "themeProvider.themeMode")
    content = content.replace("erp.toggleThemeMode", "themeProvider.toggleThemeMode")

    content = re.sub(r"erp\.recordSale\((.*?)\)", r"transaction.recordSale(\1, core, inventory)", content)
    content = re.sub(r"erp\.recordExpense\((.*?)\)", r"transaction.recordExpense(\1, core)", content)
    content = re.sub(r"erp\.addProduct\((.*?)\)", r"inventory.addProduct(\1, core)", content)
    content = re.sub(r"erp\.reorderProduct\((.*?)\)", r"inventory.reorderProduct(\1, core)", content)
    content = re.sub(r"erp\.assignTask\((.*?)\)", r"task.assignTask(\1, core)", content)
    content = re.sub(r"erp\.updateTaskProgress\((.*?)\)", r"task.updateTaskProgress(\1, core)", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
