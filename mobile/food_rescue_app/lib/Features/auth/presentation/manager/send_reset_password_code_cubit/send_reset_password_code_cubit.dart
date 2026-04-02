import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/send_reset_password_code_usecase.dart';

part 'send_reset_password_code_state.dart';

class SendResetPasswordCodeCubit extends Cubit<SendResetPasswordCodeState> {
  SendResetPasswordCodeCubit(this.resetPasswordUsecase)
    : super(SendResetPasswordCodeInitialState());
  final SendResetPasswordCodeUsecase resetPasswordUsecase;

  Future<void> resetPassword({required String email}) async {
    emit(SendResetPasswordCodeLoadingState());
    var result = await resetPasswordUsecase.call(email);
    result.fold(
      (failure) {
        emit(
          SendResetPasswordCodeFailureState(errMessage: failure.errorMessage),
        );
      },
      (success) {
        emit(SendResetPasswordCodeSucessState());
      },
    );
  }
}
