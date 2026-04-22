import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:waste2taste/Features/profile/data/models/change_password_response_model.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../domain/repos/profile_repo.dart';
import '../datasources/profile_remote_data_source.dart';
import '../models/edit_profile_request_model.dart';
import '../models/edit_profile_response_model.dart';
import '../models/change_password_request_model.dart';


class ProfileRepoImpl extends ProfileRepo {
  ProfileRepoImpl({required this.profileRemoteDataSource});
  final ProfileRemoteDataSource profileRemoteDataSource;

  @override
  Future<Either<Failure, EditProfileResponseModel>> editProfile(
    EditProfileRequestModel requestModel,
  ) async {
    try {
      var result = await profileRemoteDataSource.editProfile(requestModel);
      debugPrint("result: ${result.message}");
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
  Future<Either<Failure, ChangePasswordResponseModel>> changePassword(
    ChangePasswordRequestModel requestModel,
  ) async {
    try {
      var result = await profileRemoteDataSource.changePassword(requestModel);
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
  Future<Either<Failure, NoParam>> deleteAccount() async {
    try {
      await profileRemoteDataSource.deleteAccount();
      return Right(NoParamImpl());
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      } else {
        return left(ServerFailure(errorMessage: e.toString()));
      }
    }
  }
}
