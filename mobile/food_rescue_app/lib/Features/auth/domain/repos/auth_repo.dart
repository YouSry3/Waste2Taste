import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/signup_request_params_model.dart';

abstract class AuthRepo {
  Future<Either<Failure, UserEntity>> signup(SignupRequestModel signupReqModel);
  Future<Either<Failure, void>> resetPassword({required String email});
}
