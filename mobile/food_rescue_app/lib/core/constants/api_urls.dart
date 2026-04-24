import 'package:waste2taste/core/constants/api_endpoints.dart';

abstract class ApiUrls {
  static const baseUrl = 'http://waste2taste.runasp.net';
  static const signupUrl = "$baseUrl${ApiEndPoints.signupEndPoint}";
  static const loginUrl = "$baseUrl${ApiEndPoints.loginEndPoint}";
  static const sendResetPasswordCode =
      "$baseUrl${ApiEndPoints.sendResetPasswordCodeEndPoint}";
  static const verifyEmail = "$baseUrl${ApiEndPoints.verifyEmailEndPoint}";
  static const resetPassword = "$baseUrl${ApiEndPoints.resetPasswordEndPoint}";
  static const profile = "$baseUrl${ApiEndPoints.profileEndPoint}";
  static const productsUrl = "$baseUrl${ApiEndPoints.productsEndPoint}";
  static const editProfile = "$baseUrl${ApiEndPoints.editProfileEndPoint}";
  static const changePassword = "$baseUrl${ApiEndPoints.changePasswordEndPoint}";
  static const deleteAccount = "$baseUrl${ApiEndPoints.deleteAccountEndPoint}";
  static const getProductReviews =
      "$baseUrl${ApiEndPoints.getProductReviewsEndPoint}";
  static const addReview = "$baseUrl${ApiEndPoints.addReviewEndPoint}";
  static const deleteReview = "$baseUrl${ApiEndPoints.deleteReviewEndPoint}";
  static const reportUrl = "$baseUrl${ApiEndPoints.reportEndPoint}";
}
