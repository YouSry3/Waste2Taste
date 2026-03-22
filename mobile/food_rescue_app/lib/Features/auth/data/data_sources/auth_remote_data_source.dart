import 'package:waste2taste/Features/auth/data/models/user_model.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import '../../../../core/constants/api_urls.dart';
import '../../../../core/services/api_service.dart';
import '../models/signup_request_params_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserEntity> signup(SignupRequestModel signupReqModel);
  Future<void> resetPassword({required String email});
}

class AuthRemoteDataSourceImpl extends AuthRemoteDataSource {
  AuthRemoteDataSourceImpl(this._apiService);
  final ApiService _apiService;

  @override
  Future<UserEntity> signup(SignupRequestModel signupReqModel) async {
    var response = await _apiService.post(
      ApiUrls.signupUrl,
      data: signupReqModel.toJson(),
    );
    var data = response.data as Map<String, dynamic>;
    return UserModel.fromJson(data);
  }

  @override
  Future<void> resetPassword({required String email}) async =>
      await _apiService.post(ApiUrls.resetPassword, data: {'email': email});
}
