import 'app_regex.dart';

abstract class AppValidations {
  static String? validateEmail(String? data) {
    if (data == null || data.isEmpty) {
      return "email can't be empty";
    }
    if (!AppRegex.isEmailValid(data)) {
      return "email is not valid";
    }
    return null;
  }

  static String? validatePassword(String? data) {
    if (data == null || data.isEmpty) {
      return "password can't be empty";
    }
    if (data.length < 8) {
      return "password must be at least 8 characters";
    }
    if (!AppRegex.isContainsNumber(data)) {
      return "password must contain at least one number";
    }
    if (!AppRegex.isContainsCapitalLetter(data)) {
      return "password must contain at least one uppercase letter";
    }
    return null;
  }

  static String? validateConfirmPassword(String? data, String? newData) {
    if (data != newData) {
      return 'Password not match';
    }
    return null;
  }

  static String? validateName(String? data) {
    if (data == null || data.isEmpty) {
      return "name can't be empty";
    }
    if (data.length < 6) {
      return "name must be at least 6 characters";
    }
    return null;
  }

  static String? validatePhone(String? data) {
    if (data == null || data.isEmpty) {
      return "phone can't be empty";
    }
    if (!AppRegex.isPhoneNumberValid(data)) {
      return "phone number is not valid";
    }
    return null;
  }
}
