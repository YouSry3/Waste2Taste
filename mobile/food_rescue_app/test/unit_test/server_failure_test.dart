import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:waste2taste/core/errors/failure.dart';

void main() {
  group('ServerFailure tests', () {
    group('fromDioException tests', () {
      test('should map connectionTimeout to connection timeout message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionTimeout,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Connection timeout with api server.');
      });

      test('should map sendTimeout to send timeout message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.sendTimeout,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Send timeout with api server.');
      });

      test('should map receiveTimeout to receive timeout message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.receiveTimeout,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Recieve timeout with api server.');
      });

      test('should map badCertificate to bad certificate message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.badCertificate,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Connection failed. Please try again later.');
      });

      test('should map cancel to canceled message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.cancel,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Request with api server was canceled.');
      });

      test('should map connectionError to connection error message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionError,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(
          failure.errorMessage,
          'Unable to connect to the server. Please check your internet connection and try again.',
        );
      });

      test('should map unknown to unknown error message', () {
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.unknown,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(
          failure.errorMessage,
          'An unexpected error occurred. Please try again later.',
        );
      });
    });

    group('fromBadResponse tests', () {
      test('should parse 400, 401, 403 response data correctly', () {
        final response = Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 400,
          data: {
            'description': 'Invalid input parameters',
          },
        );
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.badResponse,
          response: response,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Invalid input parameters');
      });

      test('should parse 404 response with string body', () {
        final response = Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 404,
          data: 'Not Found String',
        );
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.badResponse,
          response: response,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Not Found String');
      });

      test('should parse 500 response message', () {
        final response = Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
          data: {},
        );
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.badResponse,
          response: response,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Internal server error, Please try again later.');
      });

      test('should parse fallback message for unhandled status code', () {
        final response = Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 429, // Too many requests
          data: {},
        );
        final exception = DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.badResponse,
          response: response,
        );
        final failure = ServerFailure.fromDioException(exception);
        expect(failure.errorMessage, 'Opps there was an error, Please try again later.');
      });
    });
  });
}
