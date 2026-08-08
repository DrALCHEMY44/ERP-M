import os
import re

def fix_task_provider():
    p = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\providers\task_provider.dart"
    with open(p, 'r', encoding='utf-8') as f: content = f.read()
    if "import '../models/app_user.dart';" not in content:
        content = content.replace("import '../services/auth_service.dart';", "import '../services/auth_service.dart';\nimport '../models/app_user.dart';")
        with open(p, 'w', encoding='utf-8') as f: f.write(content)

def fix_login_screen():
    p = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\screens\login_screen.dart"
    with open(p, 'r', encoding='utf-8') as f: content = f.read()
    content = content.replace("task.loadData(),", "taskProvider.loadData(),")
    with open(p, 'w', encoding='utf-8') as f: f.write(content)

def fix_dashboard_screen():
    p = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\screens\dashboard_screen.dart"
    with open(p, 'r', encoding='utf-8') as f: content = f.read()
    content = content.replace("task.loadData(),", "taskProvider.loadData(),")
    content = content.replace("final task = Provider.of<TaskProvider>(context);", "final taskProvider = Provider.of<TaskProvider>(context);")
    content = content.replace("task.tasks", "taskProvider.tasks")
    with open(p, 'w', encoding='utf-8') as f: f.write(content)

def fix_expenses_screen():
    p = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\screens\expenses_screen.dart"
    with open(p, 'r', encoding='utf-8') as f: content = f.read()
    # It has: transaction.recordExpense(\n                    _selectedCategory,\n                    _descController.text,\n                    amount,\n                  );
    content = re.sub(r"transaction\.recordExpense\((.*?),(.*?),(.*?)\)", r"transaction.recordExpense(\1,\2,\3, core)", content, flags=re.DOTALL)
    with open(p, 'w', encoding='utf-8') as f: f.write(content)

def fix_core_provider():
    p = r"c:\Users\kali\Pictures\project\ERP-M\erp_mobile\lib\providers\core_provider.dart"
    with open(p, 'r', encoding='utf-8') as f: content = f.read()
    if "askAi" not in content:
        ai_method = """
  Future<String> askAi(String prompt) async {
    setLoading(true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await logActivity('AI_ASSISTANT', 'AI', 'User asked AI: $prompt');
      return "This is a simulated AI response to: $prompt";
    } catch (e) {
      print('AI error: $e');
      return "Sorry, I could not process that request.";
    } finally {
      setLoading(false);
    }
  }
}
"""
        content = content.replace("}\n", "}\n" + ai_method)
        # cleanup double closing braces if we appended
        content = content.replace("}\n\n  Future<String> askAi", "  Future<String> askAi")
        content = content.replace("}\n\n\n  Future<String> askAi", "  Future<String> askAi")
        
        with open(p, 'w', encoding='utf-8') as f: f.write(content)

fix_task_provider()
fix_login_screen()
fix_dashboard_screen()
fix_expenses_screen()
fix_core_provider()
print("Done fixing compile errors")
