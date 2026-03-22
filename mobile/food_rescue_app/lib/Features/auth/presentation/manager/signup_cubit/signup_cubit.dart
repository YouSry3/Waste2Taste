import 'dart:developer';

import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/data/models/signup_request_params_model.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/signup_usecase.dart';

part 'signup_state.dart';

class SignupCubit extends Cubit<SignupState> {
  SignupCubit(this.signupUseCase) : super(SignupInitialState());
  final SignupUsecase signupUseCase;

  Future<void> signup({required SignupRequestModel requestModel}) async {
    emit(SignupLoadingState());
    var result = await signupUseCase.call(requestModel);
    result.fold(
      (failure) {
        emit(SignupFailureState(errMessage: failure.errorMessage));
      },
      (success) {
        emit(SignupSuccessState());
      },
    );
  }
}
