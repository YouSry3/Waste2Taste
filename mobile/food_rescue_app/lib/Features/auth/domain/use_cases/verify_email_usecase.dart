import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_response_model.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/verify_email_request_model.dart';
import '../repos/auth_repo.dart';

class VerifyEmailUsecase
    extends UseCase<VerifyEmailResponseModel, VerifyEmailRequestModel> {
  final AuthRepo authRepo;

  VerifyEmailUsecase({required this.authRepo});

  @override
  Future<Either<Failure, VerifyEmailResponseModel>> call(
    VerifyEmailRequestModel param,
  ) async => await authRepo.verifyEmail(param);
}
