import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/edit_profile_response_model.dart';
import '../../data/models/edit_profile_request_model.dart';
import '../../data/models/change_password_request_model.dart';
import '../../data/models/change_password_response_model.dart';

abstract class ProfileRepo {
  Future<Either<Failure, EditProfileResponseModel>> editProfile(EditProfileRequestModel requestModel);
  Future<Either<Failure, ChangePasswordResponseModel>> changePassword(ChangePasswordRequestModel requestModel);
}
