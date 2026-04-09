part of 'verify_email_cubit.dart';

@immutable
sealed class VerifyEmailState {}

final class VerifyEmailInitial extends VerifyEmailState {}

final class VerifyEmailLoadingState extends VerifyEmailState {}

final class VerifyEmailFailureState extends VerifyEmailState {
  final String errMessage;
  VerifyEmailFailureState({required this.errMessage});
}

final class VerifyEmailSuccessState extends VerifyEmailState {}
