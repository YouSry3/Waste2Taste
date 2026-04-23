import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../../domain/entities/user_entity.dart';
import '../../../domain/use_cases/get_profile_usecase.dart';

part 'get_profile_state.dart';

class GetProfileCubit extends Cubit<GetProfileState> {
  GetProfileCubit(this.getProfileUsecase) : super(GetProfileInitialState());
  final GetProfileUsecase getProfileUsecase;

  Future<void> getProfile() async {
    emit(GetProfileLoadingState());
    var result = await getProfileUsecase.call();
    result.fold(
      (failure) =>
          emit(GetProfileFailureState(errMessage: failure.errorMessage)),
      (success) => emit(GetProfileSuccessState(userEntity: success)),
    );
  }
}
