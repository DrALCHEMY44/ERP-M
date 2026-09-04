import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;

import 'api_config.dart';
import 'session_store.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  bool get isAuthenticationFailure => statusCode == 401 || statusCode == 403;
  bool get isTransient =>
      statusCode == 502 || statusCode == 503 || statusCode == 504;

  @override
  String toString() => message;
}

class DownloadedFile {
  final Uint8List bytes;
  final String? contentType;

  const DownloadedFile(this.bytes, this.contentType);
}

class ApiService {
  static String get baseUrl => ApiConfig.baseUrl;

  static Future<String> _token() async {
    final token = await SessionStore.readToken();
    if (token == null || token.isEmpty) {
      throw const ApiException('Authentication required.', statusCode: 401);
    }
    return token;
  }

  static Future<Map<String, dynamic>> request(
    String path, {
    String method = 'GET',
    Map<String, dynamic>? body,
    Duration timeout = const Duration(seconds: 20),
    bool retryTransient = false,
  }) async {
    final token = await _token();
    final uri = Uri.parse('$baseUrl$path');
    final headers = <String, String>{
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    for (var attempt = 0; ; attempt += 1) {
      try {
        final request = switch (method.toUpperCase()) {
          'POST' => http.post(
            uri,
            headers: headers,
            body: jsonEncode(body ?? {}),
          ),
          'PATCH' => http.patch(
            uri,
            headers: headers,
            body: jsonEncode(body ?? {}),
          ),
          'DELETE' => http.delete(
            uri,
            headers: headers,
            body: body == null ? null : jsonEncode(body),
          ),
          _ => http.get(uri, headers: headers),
        };
        final response = await request.timeout(timeout);

        Map<String, dynamic> decoded;
        try {
          decoded = response.body.isEmpty
              ? <String, dynamic>{}
              : jsonDecode(response.body) as Map<String, dynamic>;
        } on FormatException {
          throw ApiException(
            'The server returned an invalid response.',
            statusCode: response.statusCode,
          );
        }
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return decoded;
        }
        final exception = ApiException(
          decoded['error']?.toString() ?? 'Server request failed.',
          statusCode: response.statusCode,
        );
        if (!retryTransient || !exception.isTransient || attempt >= 2) {
          throw exception;
        }
        await Future<void>.delayed(Duration(milliseconds: 600 * (attempt + 1)));
      } on TimeoutException {
        if (!retryTransient || attempt >= 2) {
          throw const ApiException('The request timed out. Please retry.');
        }
      } on http.ClientException {
        if (!retryTransient || attempt >= 2) {
          throw const ApiException('Could not reach the SmartERP server.');
        }
      }
    }
  }

  static Future<Map<String, dynamic>> uploadFile(PlatformFile file) async {
    final length = await file.length();
    if (length <= 0) throw const ApiException('The selected file is empty.');
    if (length > 25 * 1024 * 1024) {
      throw const ApiException('Files must be 25 MB or smaller.');
    }
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/files'),
    );
    request.headers['Authorization'] = 'Bearer ${await _token()}';
    request.files.add(
      http.MultipartFile.fromBytes(
        'file',
        await file.readAsBytes(),
        filename: file.name,
      ),
    );
    final streamed = await request.send().timeout(const Duration(seconds: 90));
    final response = await http.Response.fromStream(streamed);
    final decoded = response.body.isEmpty
        ? <String, dynamic>{}
        : jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        decoded['error']?.toString() ?? 'File upload failed.',
        statusCode: response.statusCode,
      );
    }
    return decoded;
  }

  static Future<DownloadedFile> downloadFile(String fileUrl) async {
    final apiUri = Uri.parse(baseUrl);
    final uri = fileUrl.startsWith('http')
        ? Uri.parse(fileUrl)
        : Uri.parse('$baseUrl$fileUrl');
    final sameOrigin =
        uri.scheme == apiUri.scheme &&
        uri.host == apiUri.host &&
        uri.port == apiUri.port;
    if (!sameOrigin && uri.scheme != 'https') {
      throw const ApiException('External document links must use HTTPS.');
    }
    // Never attach the ERP bearer token to third-party document URLs.
    final headers = sameOrigin
        ? {'Authorization': 'Bearer ${await _token()}'}
        : const <String, String>{};
    final response = await http
        .get(uri, headers: headers)
        .timeout(const Duration(seconds: 90));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      var message = 'File download failed.';
      try {
        message =
            (jsonDecode(response.body) as Map<String, dynamic>)['error']
                ?.toString() ??
            message;
      } catch (_) {}
      throw ApiException(message, statusCode: response.statusCode);
    }
    return DownloadedFile(response.bodyBytes, response.headers['content-type']);
  }

  static Future<void> deleteManagedFile(String fileUrl) async {
    if (!fileUrl.startsWith('/api/files?')) return;
    final response = await http.delete(
      Uri.parse('$baseUrl$fileUrl'),
      headers: {'Authorization': 'Bearer ${await _token()}'},
    );
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        'Stored file cleanup failed.',
        statusCode: response.statusCode,
      );
    }
  }
}
