import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/domain/repos/auth_repo.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../data/models/signup_request_params_model.dart';

class SignupUsecase extends UseCase<void, SignupRequestModel> {
  final AuthRepo authRepo;

  SignupUsecase({required this.authRepo});

  @override
  Future<Either<Failure, void>> call(SignupRequestModel param) async =>
      await authRepo.signup(param);
}
