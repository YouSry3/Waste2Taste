part of 'send_reset_password_code_cubit.dart';

@immutable
sealed class SendResetPasswordCodeState {}

final class SendResetPasswordCodeInitialState
    extends SendResetPasswordCodeState {}

final class SendResetPasswordCodeLoadingState
    extends SendResetPasswordCodeState {}

final class SendResetPasswordCodeFailureState
    extends SendResetPasswordCodeState {
  final String errMessage;

  SendResetPasswordCodeFailureState({required this.errMessage});
}

final class SendResetPasswordCodeSucessState
    extends SendResetPasswordCodeState {}
