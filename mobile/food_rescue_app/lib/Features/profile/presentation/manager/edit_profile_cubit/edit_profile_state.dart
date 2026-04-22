part of 'edit_profile_cubit.dart';

@immutable
sealed class EditProfileState {}

final class EditProfileInitialState extends EditProfileState {}

final class EditProfileLoadingState extends EditProfileState {}

final class EditProfileSuccessState extends EditProfileState {
  final EditProfileResponseModel responseModel;

  EditProfileSuccessState({required this.responseModel});
}

final class EditProfileFailureState extends EditProfileState {
  final String errMessage;

  EditProfileFailureState({required this.errMessage});
}
