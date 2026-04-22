import 'package:dio/dio.dart';
import '../../../../core/constants/api_urls.dart';
import '../../../../core/database/flutter_secure_storage_service.dart';
import '../../../../core/functions/setup_service_locator.dart';
import '../../../../core/services/api_service.dart';
import '../models/edit_profile_request_model.dart';
import '../models/edit_profile_response_model.dart';
import '../models/change_password_request_model.dart';
import '../models/change_password_response_model.dart';

abstract class ProfileRemoteDataSource {
  Future<EditProfileResponseModel> editProfile(
    EditProfileRequestModel requestModel,
  );
  Future<ChangePasswordResponseModel> changePassword(
    ChangePasswordRequestModel requestModel,
  );
  Future<void> deleteAccount();
}

class ProfileRemoteDataSourceImpl extends ProfileRemoteDataSource {
  ProfileRemoteDataSourceImpl(this._apiService);
  final ApiService _apiService;

  @override
  Future<EditProfileResponseModel> editProfile(
    EditProfileRequestModel requestModel,
  ) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();

    var requestData = requestModel.toJson();
    if (requestData['Image'] != null &&
        !requestData['Image'].toString().startsWith('http')) {
      requestData['Image'] = await MultipartFile.fromFile(requestData['Image']);
    }

    var formData = FormData.fromMap(requestData);

    var response = await _apiService.put(
      ApiUrls.editProfile,
      data: formData,
      options: Options(headers: {'Authorization': 'Bearer ${tokens!.token}'}),
    );
    var data = response.data as Map<String, dynamic>;
    return EditProfileResponseModel.fromJson(data);
  }

  @override
  Future<ChangePasswordResponseModel> changePassword(
    ChangePasswordRequestModel requestModel,
  ) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();

    var response = await _apiService.put(
      ApiUrls.changePassword,
      data: requestModel.toJson(),
      options: Options(headers: {'Authorization': 'Bearer ${tokens!.token}'}),
    );
    var data = response.data as Map<String, dynamic>;
    return ChangePasswordResponseModel.fromJson(data);
  }

  @override
  Future<void> deleteAccount() async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();

    await _apiService.delete(
      ApiUrls.deleteAccount,
      options: Options(headers: {'Authorization': 'Bearer ${tokens!.token}'}),
    );
   
   
  }
}
