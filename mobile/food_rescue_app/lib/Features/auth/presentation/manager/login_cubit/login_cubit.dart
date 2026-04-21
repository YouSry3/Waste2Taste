import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/login_usecase.dart';
import '../../../domain/entities/user_entity.dart';

part 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit(this.loginUsecase) : super(LoginInitialState());

  final LoginUsecase loginUsecase;
  Future<void> login({required LoginRequestModel requestModel}) async {
    emit(LoginLoadingState());
    var result = await loginUsecase.call(requestModel);
    result.fold(
      (failure) {
        emit(LoginFailureState(errMessage: failure.errorMessage));
      },
      (success) {
        emit(LoginSuccessState(user: success));
      },
    );
  }
}
