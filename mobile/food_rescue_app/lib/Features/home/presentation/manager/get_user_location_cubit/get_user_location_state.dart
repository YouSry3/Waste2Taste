part of 'get_user_location_cubit.dart';

@immutable
sealed class GetUserLocationState {}

final class GetUserLocationInitialState extends GetUserLocationState {}

final class GetUserLocationLoadingState extends GetUserLocationState {}

final class GetUserLocationSuccessState extends GetUserLocationState {
  final LocationEntity locationEntity;

  GetUserLocationSuccessState({required this.locationEntity});
}

final class GetUserLocationFailureState extends GetUserLocationState {
  final String errMessage;

  GetUserLocationFailureState({required this.errMessage});
}
