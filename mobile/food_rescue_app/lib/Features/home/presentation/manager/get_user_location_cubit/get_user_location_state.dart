part of 'get_user_location_cubit.dart';

@immutable
sealed class GetUserLocationState {}

final class GetUserLocationInitialState extends GetUserLocationState {}

final class GetUserLocationLoadingState extends GetUserLocationState {}

final class GetUserLocationFailureState extends GetUserLocationState {}

final class GetUserLocationSuccessState extends GetUserLocationState {
  final LocationEntity location;

  GetUserLocationSuccessState({required this.location});
}
