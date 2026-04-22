import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/usecase/use_case.dart';
import '../../../../core/errors/failure.dart';
import '../repos/profile_repo.dart';

class DeleteAccountUsecase extends UseCase<NoParam, NoParam> {
  final ProfileRepo profileRepo;

  DeleteAccountUsecase(this.profileRepo);

  @override
  Future<Either<Failure, NoParam>> call(NoParam param) async {
    return await profileRepo.deleteAccount();
  }
}
