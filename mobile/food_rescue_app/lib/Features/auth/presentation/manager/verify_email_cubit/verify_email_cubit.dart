import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_request_model.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/verify_email_usecase.dart';

part 'verify_email_state.dart';

class VerifyEmailCubit extends Cubit<VerifyEmailState> {
  VerifyEmailCubit(this.verifyEmailUseCase) : super(VerifyEmailInitial());
  final VerifyEmailUsecase verifyEmailUseCase;

  Future<void> verifyEmail({required VerifyEmailRequestModel requestModel}) async {
    emit(VerifyEmailLoadingState());
    var result = await verifyEmailUseCase.call(requestModel);
    result.fold(
      (failure) {
        emit(VerifyEmailFailureState(errMessage: failure.errorMessage));
      },
      (success) {
        emit(VerifyEmailSuccessState());
      },
    );
  }
}
