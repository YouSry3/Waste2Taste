import 'package:waste2taste/core/constants/api_endpoints.dart';

abstract class ApiUrls {
  static const baseUrl = 'http://waste2taste.runasp.net';
  static const signupUrl = "$baseUrl${ApiEndPoints.signupEndPoint}";
  static const loginUrl = "$baseUrl${ApiEndPoints.loginEndPoint}";
  static const sendResetPasswordCode =
      "$baseUrl${ApiEndPoints.sendResetPasswordCodeEndPoint}";
  static const verifyEmail = "$baseUrl${ApiEndPoints.verifyEmailEndPoint}";
  static const resetPassword = "$baseUrl${ApiEndPoints.resetPasswordEndPoint}";
}
