abstract class ApiEndPoints {
  static const signupEndPoint = "/Auth/register";
  static const loginEndPoint = "/Auth/login";
  static const sendResetPasswordCodeEndPoint = "/Auth/password-reset-code";
  static const verifyEmailEndPoint = "/Auth/verify-reset-code";
  static const resetPasswordEndPoint = "/Auth/reset-password";
  static const profileEndPoint = "/User/Profile";
  static const productsEndPoint = "/Products";
  static const editProfileEndPoint = "/User/Profile";
  static const changePasswordEndPoint = "/User/profile/change-password";
  static const deleteAccountEndPoint = "/user/delete";
  static const getProductReviewsEndPoint = "/Reviews/product";
  static const addReviewEndPoint = "/Reviews/Add";
  static const deleteReviewEndPoint = "/Reviews";
}
