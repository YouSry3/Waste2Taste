import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../entities/user_entity.dart';

abstract class HomeRepo {
  Future<Either<Failure, UserEntity>> getProfile();
}
