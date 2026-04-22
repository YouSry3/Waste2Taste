import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../entities/user_entity.dart';
import '../repos/home_repo.dart';

class GetProfileUsecase extends UseCase<UserEntity, NoParam> {
  GetProfileUsecase({required this.homeRepo});
  final HomeRepo homeRepo;

  @override
  Future<Either<Failure, UserEntity>> call([NoParam? param]) async =>
      await homeRepo.getProfile();
}
