import 'package:dartz/dartz.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_response_model.dart';
import 'package:waste2taste/Features/auth/domain/repos/auth_repo.dart';
import 'package:waste2taste/core/errors/failure.dart';
import 'package:waste2taste/core/usecase/use_case.dart';

class ResetPassUsecase
    extends UseCase<ResetPassResponseModel, ResetPassRequestModel> {
  final AuthRepo authRepo;

  ResetPassUsecase({required this.authRepo});
  @override
  Future<Either<Failure, ResetPassResponseModel>> call(
    ResetPassRequestModel param,
  ) async => await authRepo.restNewPassword(param);
}
