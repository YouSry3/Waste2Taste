import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../../../../core/errors/failure.dart';
import '../../domain/repos/profile_repo.dart';
import '../datasources/profile_remote_data_source.dart';
import '../models/edit_profile_request_model.dart';
import '../models/edit_profile_response_model.dart';

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
}
