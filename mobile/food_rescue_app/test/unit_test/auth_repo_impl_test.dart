import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/auth/data/data_sources/auth_remote_data_source.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_response_model.dart';
import 'package:waste2taste/Features/auth/data/models/signup_request_params_model.dart';
import 'package:waste2taste/Features/auth/data/models/signup_response_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_response_model.dart';
import 'package:waste2taste/Features/auth/data/repos/auth_repo_impl.dart';

class MockAuthRemoteDataSource extends Mock implements AuthRemoteDataSource {}

void main() {
  late AuthRepoImpl authRepo;
  late MockAuthRemoteDataSource mockDataSource;

  setUp(() {
    mockDataSource = MockAuthRemoteDataSource();
    authRepo = AuthRepoImpl(authRemoteDataSource: mockDataSource);
  });

  group('AuthRepoImpl tests', () {
    final signupReqModel = SignupRequestModel(
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '01012345678',
      password: 'Password123',
    );
    const signupResModel = SignupResponseModel(
      email: 'john@example.com',
      name: 'John Doe',
      role: 'customer',
    );

    final loginReqModel = LoginRequestModel(email: 'john@example.com', password: 'Password123');
    final loginResKeys = UserLoginKeys(
      token: 'token',
      refreshToken: 'refresh',
      expireAt: DateTime.now(),
      userId: '123',
    );

    test('signup should return Right(SignupResponseModel) on success', () async {
      when(() => mockDataSource.signup(signupReqModel)).thenAnswer((_) async => signupResModel);

      final result = await authRepo.signup(signupReqModel);
      expect(result, const Right(signupResModel));
    });

    test('signup should return Left(ServerFailure) on DioException', () async {
      when(() => mockDataSource.signup(signupReqModel)).thenThrow(
        DioException(
          requestOptions: RequestOptions(path: ''),
          type: DioExceptionType.connectionTimeout,
        ),
      );

      final result = await authRepo.signup(signupReqModel);
      expect(result.isLeft(), isTrue);
      result.fold(
        (failure) => expect(failure.errorMessage, 'Connection timeout with api server.'),
        (_) => fail('Expected a Left failure'),
      );
    });

    test('login should return Right(UserLoginKeys) on success', () async {
      when(() => mockDataSource.login(loginReqModel)).thenAnswer((_) async => loginResKeys);

      final result = await authRepo.login(loginReqModel);
      expect(result, Right(loginResKeys));
    });

    test('login should return Left(ServerFailure) on generic Exception', () async {
      when(() => mockDataSource.login(loginReqModel)).thenThrow(Exception('Something went wrong'));

      final result = await authRepo.login(loginReqModel);
      expect(result.isLeft(), isTrue);
      result.fold(
        (failure) => expect(failure.errorMessage, 'Exception: Something went wrong'),
        (_) => fail('Expected a Left failure'),
      );
    });

    test('sendResetPasswordCode should return Right(void) on success', () async {
      when(() => mockDataSource.sendResetPasswordCode(email: 'john@example.com')).thenAnswer((_) async => null);

      final result = await authRepo.sendResetPasswordCode(email: 'john@example.com');
      expect(result, const Right(null));
    });

    test('verifyEmail should return Right(VerifyEmailResponseModel) on success', () async {
      final req = VerifyEmailRequestModel(email: 'john@example.com', code: '123456');
      final res = VerifyEmailResponseModel(message: 'verified');
      when(() => mockDataSource.verifyEmail(req)).thenAnswer((_) async => res);

      final result = await authRepo.verifyEmail(req);
      expect(result, Right(res));
    });

    test('restNewPassword should return Right(ResetPassResponseModel) on success', () async {
      final req = ResetPassRequestModel(
        email: 'john@example.com',
        code: '123456',
        newPassword: 'New',
      );
      final res = ResetPassResponseModel(message: 'changed');
      when(() => mockDataSource.restNewPassword(req)).thenAnswer((_) async => res);

      final result = await authRepo.restNewPassword(req);
      expect(result, Right(res));
    });
  });
}
