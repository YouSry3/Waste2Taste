import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';
import 'package:waste2taste/Features/auth/domain/repos/auth_repo.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/login_usecase.dart';
import 'package:waste2taste/core/errors/failure.dart';

class MockAuthRepo extends Mock implements AuthRepo {}

void main() {
  late LoginUsecase loginUsecase;
  late MockAuthRepo mockAuthRepo;

  setUp(() {
    mockAuthRepo = MockAuthRepo();
    loginUsecase = LoginUsecase(authRepo: mockAuthRepo);
  });

  group('LoginUsecase tests', () {
    final requestModel = LoginRequestModel(email: 'john@example.com', password: 'Password123');
    final keys = UserLoginKeys(
      token: 'token',
      refreshToken: 'refresh',
      expireAt: DateTime.now(),
      userId: '123',
    );

    test('should call login on authRepo and return UserLoginKeys on success', () async {
      when(() => mockAuthRepo.login(requestModel)).thenAnswer((_) async => Right(keys));

      final result = await loginUsecase.call(requestModel);

      expect(result, Right(keys));
      verify(() => mockAuthRepo.login(requestModel)).called(1);
    });

    test('should return Failure when authRepo login fails', () async {
      const failure = ServerFailure(errorMessage: 'Invalid credentials');
      when(() => mockAuthRepo.login(requestModel)).thenAnswer((_) async => const Left(failure));

      final result = await loginUsecase.call(requestModel);

      expect(result, const Left(failure));
      verify(() => mockAuthRepo.login(requestModel)).called(1);
    });
  });
}
