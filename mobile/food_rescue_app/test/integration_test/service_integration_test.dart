import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/auth/data/data_sources/auth_remote_data_source.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/signup_request_params_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_request_model.dart';
import 'package:waste2taste/Features/auth/data/repos/auth_repo_impl.dart';
import 'package:waste2taste/core/constants/api_urls.dart';
import 'package:waste2taste/core/database/flutter_secure_storage_service.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'package:waste2taste/core/services/api_service.dart';

class MockApiService extends Mock implements ApiService {}
class MockFlutterSecureStorageService extends Mock implements FlutterSecureStorageService {}

void main() {
  late MockApiService mockApiService;
  late MockFlutterSecureStorageService mockSecureStorage;
  late AuthRemoteDataSourceImpl authRemoteDataSource;
  late AuthRepoImpl authRepo;

  setUpAll(() {
    registerFallbackValue(UserLoginKeys(
      token: '',
      refreshToken: '',
      expireAt: DateTime.now(),
      userId: '',
    ));
  });

  setUp(() {
    mockApiService = MockApiService();
    mockSecureStorage = MockFlutterSecureStorageService();

    if (getIt.isRegistered<FlutterSecureStorageService>()) {
      getIt.unregister<FlutterSecureStorageService>();
    }
    getIt.registerSingleton<FlutterSecureStorageService>(mockSecureStorage);

    authRemoteDataSource = AuthRemoteDataSourceImpl(mockApiService);
    authRepo = AuthRepoImpl(authRemoteDataSource: authRemoteDataSource);
  });

  tearDown(() async {
    await getIt.reset();
  });

  group('Auth Service & Data Layer Integration Tests', () {
    test('should successfully sign up when remote API returns 200', () async {
      final signupReq = SignupRequestModel(
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '01012345678',
        password: 'Password123',
      );

      final apiResponse = {
        'email': 'john@example.com',
        'name': 'John Doe',
        'role': 'customer',
      };

      when(() => mockApiService.post(
        ApiUrls.signupUrl,
        data: signupReq.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.signupUrl),
        data: apiResponse,
        statusCode: 200,
      ));

      final result = await authRepo.signup(signupReq);

      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('Should have succeeded'),
        (response) {
          expect(response.email, 'john@example.com');
          expect(response.name, 'John Doe');
          expect(response.role, 'customer');
        },
      );
    });

    test('should return ServerFailure when remote API signup returns 400 Bad Request', () async {
      final signupReq = SignupRequestModel(
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '01012345678',
        password: 'Password123',
      );

      when(() => mockApiService.post(
        ApiUrls.signupUrl,
        data: signupReq.toJson(),
      )).thenThrow(DioException(
        requestOptions: RequestOptions(path: ApiUrls.signupUrl),
        type: DioExceptionType.badResponse,
        response: Response(
          requestOptions: RequestOptions(path: ApiUrls.signupUrl),
          statusCode: 400,
          data: {'description': 'Email already exists'},
        ),
      ));

      final result = await authRepo.signup(signupReq);

      expect(result.isLeft(), isTrue);
      result.fold(
        (failure) {
          expect(failure, isA<ServerFailure>());
          expect(failure.errorMessage, 'Email already exists');
        },
        (_) => fail('Should have failed'),
      );
    });

    test('should successfully log in, store token in SecureStorage, and return UserLoginKeys', () async {
      final loginReq = LoginRequestModel(email: 'john@example.com', password: 'Password123');

      final apiResponse = {
        'token': 'access-token-123',
        'refreshToken': 'refresh-token-456',
        'expireAt': 3600,
        'id': 'user-id-789',
      };

      when(() => mockApiService.post(
        ApiUrls.loginUrl,
        data: loginReq.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.loginUrl),
        data: apiResponse,
        statusCode: 200,
      ));

      when(() => mockSecureStorage.saveAuthToken(any())).thenAnswer((_) async => {});

      final result = await authRepo.login(loginReq);

      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('Should have succeeded'),
        (keys) {
          expect(keys.token, 'access-token-123');
          expect(keys.refreshToken, 'refresh-token-456');
          expect(keys.userId, 'user-id-789');
        },
      );
      verify(() => mockSecureStorage.saveAuthToken(any())).called(1);
    });

    test('should return ServerFailure when login fails due to connection timeout', () async {
      final loginReq = LoginRequestModel(email: 'john@example.com', password: 'Password123');

      when(() => mockApiService.post(
        ApiUrls.loginUrl,
        data: loginReq.toJson(),
      )).thenThrow(DioException(
        requestOptions: RequestOptions(path: ApiUrls.loginUrl),
        type: DioExceptionType.connectionTimeout,
      ));

      final result = await authRepo.login(loginReq);

      expect(result.isLeft(), isTrue);
      result.fold(
        (failure) {
          expect(failure, isA<ServerFailure>());
          expect(failure.errorMessage, 'Connection timeout with api server.');
        },
        (_) => fail('Should have failed due to timeout'),
      );
    });

    test('should successfully verify email when remote API returns 200', () async {
      final req = VerifyEmailRequestModel(email: 'john@example.com', code: '123456');
      final apiResponse = {'message': 'verified'};

      when(() => mockApiService.post(
        ApiUrls.verifyEmail,
        data: req.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.verifyEmail),
        data: apiResponse,
        statusCode: 200,
      ));

      final result = await authRepo.verifyEmail(req);

      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('Should have verified successfully'),
        (res) => expect(res.message, 'verified'),
      );
    });

    test('should successfully reset password when remote API returns 200', () async {
      final req = ResetPassRequestModel(email: 'john@example.com', code: '123456', newPassword: 'NewPassword123');
      final apiResponse = {'message': 'reset success'};

      when(() => mockApiService.post(
        ApiUrls.resetPassword,
        data: req.toJson(),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: ApiUrls.resetPassword),
        data: apiResponse,
        statusCode: 200,
      ));

      final result = await authRepo.restNewPassword(req);

      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('Should have reset password successfully'),
        (res) => expect(res.message, 'reset success'),
      );
    });
  });
}
