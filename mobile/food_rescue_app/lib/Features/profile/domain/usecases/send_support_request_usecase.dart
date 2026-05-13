import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../data/models/support_request_model.dart';
import '../repos/profile_repo.dart';

class SendSupportRequestUsecase extends UseCase<void, SupportRequestModel> {
  final ProfileRepo profileRepo;

  SendSupportRequestUsecase(this.profileRepo);

  @override
  Future<Either<Failure, void>> call(SupportRequestModel param) {
    return profileRepo.sendSupportRequest(param);
  }
}
