part of 'get_profile_cubit.dart';

@immutable
sealed class GetProfileState {}

final class GetProfileInitialState extends GetProfileState {}

final class GetProfileLoadingState extends GetProfileState {}

final class GetProfileFailureState extends GetProfileState {
  final String errMessage;

  GetProfileFailureState({required this.errMessage});
}

final class GetProfileSuccessState extends GetProfileState {
  
}
