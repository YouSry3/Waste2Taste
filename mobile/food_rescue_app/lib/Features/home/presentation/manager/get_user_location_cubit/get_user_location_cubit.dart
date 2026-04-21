import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/home/domain/entities/location_entity.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../../../../../core/services/location_service.dart';

part 'get_user_location_state.dart';

class GetUserLocationCubit extends Cubit<GetUserLocationState> {
  GetUserLocationCubit() : super(GetUserLocationInitialState());
  Future<void> getCurrentLocation() async {
    emit(GetUserLocationLoadingState());
    final location = await getIt.get<LocationService>().getCurrentLocation();
    if (location == null) {
      emit(GetUserLocationFailureState());
    } else {
      emit(GetUserLocationSuccessState(location: location));
    }
  }
}
