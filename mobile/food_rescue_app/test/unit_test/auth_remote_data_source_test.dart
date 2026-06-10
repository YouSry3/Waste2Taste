import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/auth/data/data_sources/auth_remote_data_source.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/signup_request_params_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_request_model.dart';
import 'package:waste2taste/core/constants/api_urls.dart';
import 'package:waste2taste/core/database/flutter_secure_storage_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'package:waste2taste/core/services/api_service.dart';

class MockApiService extends Mock implements ApiService {}
class MockFlutterSecureStorageService extends Mock implements FlutterSecureStorageService {}

void main() {
  late AuthRemoteDataSourceImpl authRemoteDataSource;
  late MockApiService mockApiService;
  late MockFlutterSecureStorageService mockSecureStorage;

  setUp(() {
    mockApiService = MockApiService();
    mockSecureStorage = MockFlutterSecureStorageService();
    
    registerFallbackValue(UserLoginKeys(
      token: '',
      refreshToken: '',
      expireAt: DateTime.now(),
      userId: '',
    ));

    if (getIt.isRegistered<FlutterSecureStorageService>()) {
      getIt.unregister<FlutterSecureStorageService>();
    }
    getIt.registerSingleton<FlutterSecureStorageService>(mockSecureStorage);

    authRemoteDataSource = AuthRemoteDataSourceImpl(mockApiService);
  });

  tearDown(() async {
    await getIt.reset();
  });

  group('AuthRemoteDataSourceImpl tests', () {
    test('signup should invoke ApiService POST and return SignupResponseModel', () async {
      final requestModel = SignupRequestModel(
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '01012345678',
        password: 'Password123',
      );

      final responseData = {
        'message': 'Signup successful',
        'email': 'john@example.com',
        'name': 'John Doe',
        'role': 'customer',
      };

      when(() => mockApiService.post(
        ApiUrls.signupUrl,
        data: requestModel.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.signupUrl),
        data: responseData,
        statusCode: 200,
      ));

      final result = await authRemoteDataSource.signup(requestModel);
      expect(result.email, 'john@example.com');
      expect(result.name, 'John Doe');
    });

    test('login should invoke ApiService POST, persist token, and return UserLoginKeys', () async {
      final requestModel = LoginRequestModel(
        email: 'john@example.com',
        password: 'Password123',
      );

      final responseData = {
        'token': 'mock-token',
        'refreshToken': 'mock-refresh-token',
        'expireAt': 3600,
        'id': 'user-id-123',
      };

      when(() => mockApiService.post(
        ApiUrls.loginUrl,
        data: requestModel.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.loginUrl),
        data: responseData,
        statusCode: 200,
      ));

      when(() => mockSecureStorage.saveAuthToken(any())).thenAnswer((_) async => {});

      final result = await authRemoteDataSource.login(requestModel);
      expect(result.token, 'mock-token');
      expect(result.userId, 'user-id-123');
      verify(() => mockSecureStorage.saveAuthToken(any())).called(1);
    });

    test('sendResetPasswordCode should invoke ApiService POST', () async {
      when(() => mockApiService.post(
        ApiUrls.sendResetPasswordCode,
        data: {'email': 'john@example.com'},
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.sendResetPasswordCode),
        statusCode: 200,
      ));

      await expectLater(
        authRemoteDataSource.sendResetPasswordCode(email: 'john@example.com'),
        completes,
      );
    });

    test('verifyEmail should invoke ApiService POST and return VerifyEmailResponseModel', () async {
      final requestModel = VerifyEmailRequestModel(
        email: 'john@example.com',
        code: '123456',
      );

      final responseData = {
        'message': 'OTP Verified',
      };

      when(() => mockApiService.post(
        ApiUrls.verifyEmail,
        data: requestModel.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.verifyEmail),
        data: responseData,
        statusCode: 200,
      ));

      final result = await authRemoteDataSource.verifyEmail(requestModel);
      expect(result.message, 'OTP Verified');
    });

    test('restNewPassword should invoke ApiService POST and return ResetPassResponseModel', () async {
      final requestModel = ResetPassRequestModel(
        email: 'john@example.com',
        code: '123456',
        newPassword: 'NewPassword123',
      );

      final responseData = {
        'message': 'Password reset successful',
      };

      when(() => mockApiService.post(
        ApiUrls.resetPassword,
        data: requestModel.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.resetPassword),
        data: responseData,
        statusCode: 200,
      ));

      final result = await authRemoteDataSource.restNewPassword(requestModel);
      expect(result.message, 'Password reset successful');
    });
  });
}
