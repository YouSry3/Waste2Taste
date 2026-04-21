import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_response_model.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/login_request_model.dart';
import '../../data/models/reset_pass_request_model.dart';
import '../../data/models/reset_pass_response_model.dart';
import '../../data/models/signup_request_params_model.dart';
import '../../data/models/signup_response_model.dart';
import '../entities/user_entity.dart';

abstract class AuthRepo {
  Future<Either<Failure, SignupResponseModel>> signup(
    SignupRequestModel signupReqModel,
  );
  Future<Either<Failure, UserEntity>> login(LoginRequestModel loginReqModel);

  Future<Either<Failure, void>> sendResetPasswordCode({required String email});
  Future<Either<Failure, VerifyEmailResponseModel>> verifyEmail(
    VerifyEmailRequestModel verifyEmailRequestModel,
  );
  Future<Either<Failure, ResetPassResponseModel>> restNewPassword(
    ResetPassRequestModel verifyEmailRequestModel,
  );
}
