import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../../data/models/edit_profile_request_model.dart';
import '../../../data/models/edit_profile_response_model.dart';
import '../../../domain/usecases/edit_profile_usecase.dart';

part 'edit_profile_state.dart';

class EditProfileCubit extends Cubit<EditProfileState> {
  EditProfileCubit(this.editProfileUsecase) : super(EditProfileInitialState());
  final EditProfileUsecase editProfileUsecase;

  Future<void> editProfile({required EditProfileRequestModel requestModel}) async {
    emit(EditProfileLoadingState());
    var result = await editProfileUsecase.call(requestModel);
    result.fold(
      (failure) => emit(EditProfileFailureState(errMessage: failure.errorMessage)),
      (success) => emit(EditProfileSuccessState(responseModel: success)),
    );
  }
}
