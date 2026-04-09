import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/reset_pass_usecase.dart';
part 'reset_new_password_state.dart';

class ResetNewPasswordCubit extends Cubit<ResetNewPasswordState> {
  ResetNewPasswordCubit(this.verifyEmailUseCase)
    : super(ResetNewPasswordInitialState());
  final ResetPassUsecase verifyEmailUseCase;

  Future<void> resetNewPassword({
    required ResetPassRequestModel requestModel,
  }) async {
    emit(ResetNewPasswordLoadingState());
    var result = await verifyEmailUseCase.call(requestModel);
    result.fold(
      (failure) {
        emit(ResetNewPasswordFailureState(errMessage: failure.errorMessage));
      },
      (success) {
        emit(ResetNewPasswordSuccessState(message: success.message));
      },
    );
  }
}
