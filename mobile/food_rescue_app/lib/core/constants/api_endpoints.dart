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
  static const getReviewsEndPoint =
      "/Reviews/vendor/GetReviewsWithSentiment";
  static const addReviewEndPoint = "/Reviews/Add";
  static const deleteReviewEndPoint = "/Reviews";
  static const reportEndPoint = "/Reports";
  static const reserveOrderEndPoint = "/orders";
  static const myOrdersEndPoint = "/Orders/my-orders";
  static const myFavoritesEndPoint = "/products/my-favorites";
  static const sendSupportEndPoint = "/support/send";
}
