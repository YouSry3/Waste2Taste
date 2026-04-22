import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/profile/data/models/change_password_response_model.dart';
import '../../../data/models/change_password_request_model.dart';

import '../../../domain/usecases/change_password_usecase.dart';

part 'change_password_state.dart';

class ChangePasswordCubit extends Cubit<ChangePasswordState> {
  ChangePasswordCubit(this.changePasswordUsecase)
    : super(ChangePasswordInitial());
  final ChangePasswordUsecase changePasswordUsecase;

  Future<void> changePassword({
    required ChangePasswordRequestModel requestModel,
  }) async {
    emit(ChangePasswordLoading());
    var result = await changePasswordUsecase.call(requestModel);
    result.fold(
      (failure) =>
          emit(ChangePasswordFailure(errMessage: failure.errorMessage)),
      (success) => emit(ChangePasswordSuccess(responseModel: success)),
    );
  }
}
