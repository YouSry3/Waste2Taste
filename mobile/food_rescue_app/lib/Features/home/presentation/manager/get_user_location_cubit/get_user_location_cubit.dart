import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../../domain/entities/location_entity.dart';
import '../../../domain/use_cases/get_user_location_usecase.dart';

part 'get_user_location_state.dart';

class GetUserLocationCubit extends Cubit<GetUserLocationState> {
  GetUserLocationCubit(this.getUserLocationUsecase) : super(GetUserLocationInitialState());
  final GetUserLocationUsecase getUserLocationUsecase;

  Future<void> getUserLocation() async {
    emit(GetUserLocationLoadingState());
    var result = await getUserLocationUsecase.call();
    result.fold(
      (failure) => emit(GetUserLocationFailureState(errMessage: failure.errorMessage)),
      (success) => emit(GetUserLocationSuccessState(locationEntity: success)),
    );
  }
}
