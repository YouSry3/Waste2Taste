part of 'reset_new_password_cubit.dart';

@immutable
sealed class ResetNewPasswordState {}

final class ResetNewPasswordInitialState extends ResetNewPasswordState {}

final class ResetNewPasswordLoadingState extends ResetNewPasswordState {}

final class ResetNewPasswordFailureState extends ResetNewPasswordState {
  final String errMessage;

  ResetNewPasswordFailureState({required this.errMessage});
}

final class ResetNewPasswordSuccessState extends ResetNewPasswordState {
  final String message;

  ResetNewPasswordSuccessState({required this.message});
}
