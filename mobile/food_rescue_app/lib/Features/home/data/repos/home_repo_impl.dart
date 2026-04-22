import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/errors/failure.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/entities/product_entity.dart';
import '../../domain/repos/home_repo.dart';
import '../data_sources/home_remote_data_source.dart';

class HomeRepoImpl extends HomeRepo {
  HomeRepoImpl({required this.homeRemoteDataSource});
  final HomeRemoteDataSource homeRemoteDataSource;

  @override
  Future<Either<Failure, UserEntity>> getProfile() async {
    try {
      var result = await homeRemoteDataSource.getProfile();
      return Right(result);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      } else {
        return left(ServerFailure(errorMessage: e.toString()));
      }
    }
  }

  @override
  Future<Either<Failure, List<ProductEntity>>> getProducts() async {
    try {
      var result = await homeRemoteDataSource.getProducts();
      return Right(result);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      } else {
        return left(ServerFailure(errorMessage: e.toString()));
      }
    }
  }
}
