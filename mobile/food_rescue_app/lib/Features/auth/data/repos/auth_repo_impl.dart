import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import '../../../../core/errors/failure.dart';
import '../../domain/repos/auth_repo.dart';
import '../data_sources/auth_remote_data_source.dart';
import '../models/signup_request_params_model.dart';

class AuthRepoImpl extends AuthRepo {
  AuthRepoImpl({required this.authRemoteDataSource});
  final AuthRemoteDataSource authRemoteDataSource;

  @override
  Future<Either<Failure, UserEntity>> signup(
    SignupRequestModel signupReqModel,
  ) async {
    try {
      var result = await authRemoteDataSource.signup(signupReqModel);
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
  Future<Either<Failure, void>> resetPassword({required String email}) async {
   try {
      var result = await authRemoteDataSource.resetPassword(email: email);
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
