import 'package:dio/dio.dart';
import 'package:waste2taste/Features/home/domain/entities/user_entity.dart';
import 'package:waste2taste/core/constants/api_urls.dart';
import '../../../../core/database/flutter_secure_storage_service.dart';
import '../../../../core/functions/setup_service_locator.dart';
import '../models/user_model.dart';
import '../../../../core/services/api_service.dart';

abstract class HomeRemoteDataSource {
  Future<UserEntity> getProfile();
}

class HomeRemoteDataSourceImpl extends HomeRemoteDataSource {
  HomeRemoteDataSourceImpl(this._apiService);
  final ApiService _apiService;

  @override
  Future<UserEntity> getProfile() async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    var response = await _apiService.get(
      ApiUrls.profile,
      options: Options(headers: {'Authorization': 'Bearer ${tokens!.token}'}),
    );
    var data = response.data as Map<String, dynamic>;
    return UserModel.fromJson(data);
  }
}
