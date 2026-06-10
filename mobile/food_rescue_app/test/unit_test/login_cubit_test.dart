import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/login_usecase.dart';
import 'package:waste2taste/Features/auth/presentation/manager/login_cubit/login_cubit.dart';
import 'package:waste2taste/core/errors/failure.dart';

class MockLoginUsecase extends Mock implements LoginUsecase {}

void main() {
  late MockLoginUsecase mockLoginUsecase;
  final requestModel = LoginRequestModel(email: 'john@example.com', password: 'Password123');
  final keys = UserLoginKeys(
    token: 'token',
    refreshToken: 'refresh',
    expireAt: DateTime.now(),
    userId: '123',
  );

  setUp(() {
    mockLoginUsecase = MockLoginUsecase();
  });

  group('LoginCubit tests', () {
    test('initial state should be LoginInitialState', () {
      expect(LoginCubit(mockLoginUsecase).state, isA<LoginInitialState>());
    });

    blocTest<LoginCubit, LoginState>(
      'should emit [LoginLoadingState, LoginSuccessState] when login succeeds',
      build: () {
        when(() => mockLoginUsecase.call(requestModel)).thenAnswer((_) async => Right(keys));
        return LoginCubit(mockLoginUsecase);
      },
      act: (cubit) => cubit.login(requestModel: requestModel),
      expect: () => [
        isA<LoginLoadingState>(),
        isA<LoginSuccessState>().having((s) => s.keys, 'keys', keys),
      ],
      verify: (_) {
        verify(() => mockLoginUsecase.call(requestModel)).called(1);
      },
    );

    blocTest<LoginCubit, LoginState>(
      'should emit [LoginLoadingState, LoginFailureState] when login fails',
      build: () {
        when(() => mockLoginUsecase.call(requestModel)).thenAnswer(
          (_) async => const Left(ServerFailure(errorMessage: 'Unauthorized')),
        );
        return LoginCubit(mockLoginUsecase);
      },
      act: (cubit) => cubit.login(requestModel: requestModel),
      expect: () => [
        isA<LoginLoadingState>(),
        isA<LoginFailureState>().having((s) => s.errMessage, 'errMessage', 'Unauthorized'),
      ],
      verify: (_) {
        verify(() => mockLoginUsecase.call(requestModel)).called(1);
      },
    );
  });
}
