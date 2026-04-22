part of 'change_password_cubit.dart';

@immutable
sealed class ChangePasswordState {}

final class ChangePasswordInitial extends ChangePasswordState {}

final class ChangePasswordLoading extends ChangePasswordState {}

final class ChangePasswordSuccess extends ChangePasswordState {
  final ChangePasswordResponseModel responseModel;
  ChangePasswordSuccess({required this.responseModel});
}

final class ChangePasswordFailure extends ChangePasswordState {
  final String errMessage;
  ChangePasswordFailure({required this.errMessage});
}
