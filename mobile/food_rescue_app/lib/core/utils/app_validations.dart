import 'app_regex.dart';
import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';

abstract class AppValidations {
  static String? validateEmail(BuildContext context, String? data) {
    final loc = AppLocalizations.of(context)!;
    if (data == null || data.isEmpty) {
      return loc.emailCantBeEmpty;
    }
    if (!AppRegex.isEmailValid(data)) {
      return loc.emailNotValid;
    }
    return null;
  }

  static String? validatePassword(BuildContext context, String? data) {
    final loc = AppLocalizations.of(context)!;
    if (data == null || data.isEmpty) {
      return loc.passwordCantBeEmpty;
    }
    if (data.length < 8) {
      return loc.passwordAtLeast8Chars;
    }
    if (!AppRegex.isContainsNumber(data)) {
      return loc.passwordMustContainNumber;
    }
    if (!AppRegex.isContainsCapitalLetter(data)) {
      return loc.passwordMustContainUppercase;
    }
    return null;
  }

  static String? validateConfirmPassword(
    BuildContext context,
    String? data,
    String? newData,
  ) {
    final loc = AppLocalizations.of(context)!;
    if (data != newData) {
      return loc.passwordNotMatch;
    }
    return null;
  }

  static String? validateName(BuildContext context, String? data) {
    final loc = AppLocalizations.of(context)!;
    if (data == null || data.isEmpty) {
      return loc.nameCantBeEmpty;
    }
    if (data.length < 6) {
      return loc.nameAtLeast6Chars;
    }
    return null;
  }

  static String? validatePhone(BuildContext context, String? data) {
    final loc = AppLocalizations.of(context)!;
    if (data == null || data.isEmpty) {
      return loc.phoneCantBeEmpty;
    }
    if (!AppRegex.isPhoneNumberValid(data)) {
      return loc.phoneNotValid;
    }
    return null;
  }
}

// abstract class AppValidations {
//   static String? validateEmail(String? data) {
//     if (data == null || data.isEmpty) {
//       return "email can't be empty";
//     }
//     if (!AppRegex.isEmailValid(data)) {
//       return "email is not valid";
//     }
//     return null;
//   }

//   static String? validatePassword(String? data) {
//     if (data == null || data.isEmpty) {
//       return "password can't be empty";
//     }
//     if (data.length < 8) {
//       return "password must be at least 8 characters";
//     }
//     if (!AppRegex.isContainsNumber(data)) {
//       return "password must contain at least one number";
//     }
//     if (!AppRegex.isContainsCapitalLetter(data)) {
//       return "password must contain at least one uppercase letter";
//     }
//     return null;
//   }

//   static String? validateConfirmPassword(String? data, String? newData) {
//     if (data != newData) {
//       return 'Password not match';
//     }
//     return null;
//   }

//   static String? validateName(String? data) {
//     if (data == null || data.isEmpty) {
//       return "name can't be empty";
//     }
//     if (data.length < 6) {
//       return "name must be at least 6 characters";
//     }
//     return null;
//   }

//   static String? validatePhone(String? data) {
//     if (data == null || data.isEmpty) {
//       return "phone can't be empty";
//     }
//     if (!AppRegex.isPhoneNumberValid(data)) {
//       return "phone number is not valid";
//     }
//     return null;
//   }
// }
