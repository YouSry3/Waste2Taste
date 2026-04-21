import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';

import '../repos/auth_repo.dart';

class LoginUsecase extends UseCase<UserEntity, LoginRequestModel> {
  LoginUsecase({required this.authRepo});

  final AuthRepo authRepo;
  @override
  Future<Either<Failure, UserEntity>> call(LoginRequestModel param) async =>
      await authRepo.login(param);
}
