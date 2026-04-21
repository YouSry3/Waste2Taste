part of 'login_cubit.dart';

@immutable
sealed class LoginState {}

final class LoginInitialState extends LoginState {}

final class LoginLoadingState extends LoginState {}

final class LoginSuccessState extends LoginState {
  final UserLoginKeys keys;

  LoginSuccessState({required this.keys});
}

final class LoginFailureState extends LoginState {
  final String errMessage;

  LoginFailureState({required this.errMessage});
}
