import 'package:dartz/dartz.dart';
import '../errors/failure.dart';

abstract class UseCase<T, Param> {
  Future<Either<Failure, T>> call(Param param);
}

abstract class NoParam {}
