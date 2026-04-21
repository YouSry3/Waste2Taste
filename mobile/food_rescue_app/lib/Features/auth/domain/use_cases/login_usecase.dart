import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import '../../data/models/user_login_keys.dart';
import '../repos/auth_repo.dart';

class LoginUsecase extends UseCase<UserLoginKeys, LoginRequestModel> {
  LoginUsecase({required this.authRepo});

  final AuthRepo authRepo;
  @override
  Future<Either<Failure, UserLoginKeys>> call(LoginRequestModel param) async =>
      await authRepo.login(param);
}
