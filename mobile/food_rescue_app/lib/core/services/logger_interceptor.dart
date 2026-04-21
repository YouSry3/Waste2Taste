import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

class LoggerInterceptor extends Interceptor {
  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 3,
      lineLength: 80,
      colors: true,
      printEmojis: true,
      dateTimeFormat: DateTimeFormat.onlyTime,
    ),
  );

  bool get _isDebug => kDebugMode;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (_isDebug) {
      _logger.i('''
╔════════════════ REQUEST ════════════════
║ ${options.method} => ${options.baseUrl}${options.path}
║ Headers: ${_sanitizeHeaders(options.headers)}
║ Query: ${options.queryParameters}
║ Body: ${options.data}
╚════════════════════════════════════════
''');
    }

    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (_isDebug) {
      _logger.d('''
╔════════════════ RESPONSE ═══════════════
║ ${response.requestOptions.method} => ${response.requestOptions.baseUrl}${response.requestOptions.path}
║ Status: ${response.statusCode}
║ Data: ${response.data}
╚════════════════════════════════════════
''');
    }

    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (_isDebug) {
      _logger.e('''
╔════════════════ ERROR ══════════════════
║ ${err.requestOptions.method} => ${err.requestOptions.baseUrl}${err.requestOptions.path}
║ Type: ${err.type}
║ Message: ${err.message}
║ Status: ${err.response?.statusCode}
║ Data: ${err.response?.data}
╚════════════════════════════════════════
''');
    }

    super.onError(err, handler);
  }

  /// Remove sensitive data like tokens
  Map<String, dynamic> _sanitizeHeaders(Map<String, dynamic> headers) {
    final sanitized = Map<String, dynamic>.from(headers);

    if (sanitized.containsKey('Authorization')) {
      sanitized['Authorization'] = '***TOKEN HIDDEN***';
    }

    return sanitized;
  }
}
