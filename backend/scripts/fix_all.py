import os
import re

lib_dir = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\screens"
test_dir = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\test"

# fix test
widget_test = os.path.join(test_dir, 'widget_test.dart')
with open(widget_test, 'r', encoding='utf-8') as f:
    wt_content = f.read()

wt_content = wt_content.replace("import 'package:erp_mobile/providers/erp_provider.dart';", 
"""import 'package:erp_mobile/providers/core_provider.dart';
import 'package:erp_mobile/providers/inventory_provider.dart';
import 'package:erp_mobile/providers/transaction_provider.dart';
import 'package:erp_mobile/providers/task_provider.dart';
import 'package:erp_mobile/providers/theme_provider.dart';""")

wt_content = wt_content.replace("ChangeNotifierProvider(create: (_) => ErpProvider()),",
"""ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => CoreProvider()),
        ChangeNotifierProvider(create: (_) => InventoryProvider()),
        ChangeNotifierProvider(create: (_) => TransactionProvider()),
        ChangeNotifierProvider(create: (_) => TaskProvider()),""")
with open(widget_test, 'w', encoding='utf-8') as f:
    f.write(wt_content)

for filename in os.listdir(lib_dir):
    if not filename.endswith(".dart"): continue
    
    filepath = os.path.join(lib_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # fix 'erp.' leftover
    content = content.replace("erp.recordExpense", "transaction.recordExpense")
    content = content.replace("erp.assignTask", "taskProvider.assignTask")
    content = content.replace("erp.logActivity", "core.logActivity")
    content = content.replace("erp.askAi", "core.askAi")
    content = content.replace("erp.updateTaskProgress", "taskProvider.updateTaskProgress")
    
    # fix shadow tasks
    content = content.replace("final task = Provider.of<TaskProvider>", "final taskProvider = Provider.of<TaskProvider>")
    content = content.replace("task.tasks", "taskProvider.tasks")
    
    # fix the tasks_list_screen.dart error
    content = content.replace("task.updateTaskProgress(task.id, localProgress.toInt(, core))", "taskProvider.updateTaskProgress(task.id, localProgress.toInt(), core)")
    content = content.replace("taskProvider.updateTaskProgress(task.id, localProgress.toInt(, core))", "taskProvider.updateTaskProgress(task.id, localProgress.toInt(), core)")

    # Registration screen had ErpProvider as type arg
    content = content.replace("Provider.of<ErpProvider>", "Provider.of<CoreProvider>")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing")
