import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../data/models/edit_profile_request_model.dart';
import '../../data/models/edit_profile_response_model.dart';
import '../repos/profile_repo.dart';

class EditProfileUsecase extends UseCase<EditProfileResponseModel, EditProfileRequestModel> {
  EditProfileUsecase({required this.profileRepo});
  final ProfileRepo profileRepo;
  
  @override
  Future<Either<Failure, EditProfileResponseModel>> call(EditProfileRequestModel param) async =>
      await profileRepo.editProfile(param);
}
