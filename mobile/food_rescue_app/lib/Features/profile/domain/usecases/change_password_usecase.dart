import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/change_password_request_model.dart';
import '../../data/models/change_password_response_model.dart';
import '../repos/profile_repo.dart';

class ChangePasswordUsecase
    extends UseCase<ChangePasswordResponseModel, ChangePasswordRequestModel> {
  final ProfileRepo profileRepo;

  ChangePasswordUsecase(this.profileRepo);

  @override
  Future<Either<Failure, ChangePasswordResponseModel>> call(
    ChangePasswordRequestModel requestModel,
  ) async {
    return await profileRepo.changePassword(requestModel);
  }
}
