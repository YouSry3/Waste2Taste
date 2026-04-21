import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_request_model.dart';
import 'package:waste2taste/Features/auth/data/models/reset_pass_response_model.dart';
import 'package:waste2taste/Features/auth/data/models/user_model.dart';
import 'package:waste2taste/Features/auth/data/models/verify_email_response_model.dart';
import 'package:waste2taste/Features/auth/domain/entities/user_entity.dart';
import '../../../../core/constants/api_urls.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/utils/save_token_in_secure_storage.dart';
import '../models/signup_request_params_model.dart';
import '../models/signup_response_model.dart';
import '../models/verify_email_request_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserEntity> login(LoginRequestModel loginReqModel);
  Future<SignupResponseModel> signup(SignupRequestModel signupReqModel);
  Future<void> sendResetPasswordCode({required String email});
  Future<VerifyEmailResponseModel> verifyEmail(
    VerifyEmailRequestModel verifyEmailRequestModel,
  );
  Future<ResetPassResponseModel> restNewPassword(
    ResetPassRequestModel verifyEmailRequestModel,
  );
}

class AuthRemoteDataSourceImpl extends AuthRemoteDataSource {
  AuthRemoteDataSourceImpl(this._apiService);
  final ApiService _apiService;

  @override
  Future<SignupResponseModel> signup(SignupRequestModel signupReqModel) async {
    var response = await _apiService.post(
      ApiUrls.signupUrl,
      data: signupReqModel.toJson(),
    );
    var data = response.data as Map<String, dynamic>;
    return SignupResponseModel.fromJson(data);
  }

  @override
  Future<void> sendResetPasswordCode({required String email}) async =>
      await _apiService.post(
        ApiUrls.sendResetPasswordCode,
        data: {'email': email},
      );

  @override
  Future<VerifyEmailResponseModel> verifyEmail(
    VerifyEmailRequestModel verifyEmailRequestModel,
  ) async {
    var response = await _apiService.post(
      ApiUrls.verifyEmail,
      data: verifyEmailRequestModel.toJson(),
    );
    var data = response.data as Map<String, dynamic>;
    return VerifyEmailResponseModel.fromJson(data);
  }

  @override
  Future<ResetPassResponseModel> restNewPassword(
    ResetPassRequestModel verifyEmailRequestModel,
  ) async {
    var response = await _apiService.post(
      ApiUrls.resetPassword,
      data: verifyEmailRequestModel.toJson(),
    );
    var data = response.data as Map<String, dynamic>;
    return ResetPassResponseModel.fromJson(data);
  }

  @override
  Future<UserEntity> login(LoginRequestModel loginReqModel) async {
    var response = await _apiService.post(
      ApiUrls.loginUrl,
      data: loginReqModel.toJson(),
    );
    var data = response.data as Map<String, dynamic>;
    var userEntity = UserModel.fromJson(data);
    await saveDataInSecureStorage(userEntity.userLoginKeys);
    return userEntity;
  }
}
