import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/reset_password_usecase.dart';

part 'reset_password_state.dart';

class ResetPasswordCubit extends Cubit<ResetPasswordState> {
  ResetPasswordCubit(this.resetPasswordUsecase)
    : super(ResetPasswordInitialState());
  final ResetPasswordUsecase resetPasswordUsecase;

  Future<void> resetPassword({required String email}) async {
    emit(ResetPasswordLoadingState());
    var result = await resetPasswordUsecase.call(email);
    result.fold(
      (failure) {
        emit(ResetPasswordFailureState(errMessage: failure.errorMessage));
      },
      (success) {
        emit(ResetPasswordSucessState());
      },
    );
  }
}
