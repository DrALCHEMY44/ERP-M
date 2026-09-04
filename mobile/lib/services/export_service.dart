import 'dart:convert';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';

class ExportService {
  static String _cell(Object? value) {
    var raw = value?.toString() ?? '';
    if (value is String) {
      final leading = raw.trimLeft();
      if (leading.startsWith('=') ||
          leading.startsWith('+') ||
          leading.startsWith('-') ||
          leading.startsWith('@') ||
          raw.startsWith('\t') ||
          raw.startsWith('\r')) {
        raw = "'$raw";
      }
    }
    return '"${raw.replaceAll('"', '""')}"';
  }

  static Future<Uri?> saveCsv(String filename, List<List<Object?>> rows) {
    final csv = rows.map((row) => row.map(_cell).join(',')).join('\r\n');
    return FilePicker.saveFile(
      dialogTitle: 'Save SmartERP export',
      fileName: filename,
      bytes: Uint8List.fromList(utf8.encode(csv)),
    );
  }

  static Future<Uri?> saveBytes(String filename, List<int> bytes) {
    return FilePicker.saveFile(
      dialogTitle: 'Save SmartERP file',
      fileName: filename,
      bytes: Uint8List.fromList(bytes),
    );
  }
}
