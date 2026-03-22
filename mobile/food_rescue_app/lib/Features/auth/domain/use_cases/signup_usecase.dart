import 'dart:developer';

import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import 'package:waste2taste/Features/auth/domain/repos/auth_repo.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../data/models/signup_request_params_model.dart';

class SignupUsecase extends UseCase<UserEntity, SignupRequestModel> {
  final AuthRepo authRepo;

  SignupUsecase({required this.authRepo});

  @override
  Future<Either<Failure, UserEntity>> call(SignupRequestModel param) async {
    return await authRepo.signup(param);
  }
}
