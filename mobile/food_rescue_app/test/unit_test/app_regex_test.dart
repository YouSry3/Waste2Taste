import 'package:flutter_test/flutter_test.dart';
import 'package:waste2taste/core/utils/app_regex.dart';

void main() {
  group('AppRegex tests', () {
    group('isEmailValid tests', () {
      test('should return true for valid emails', () {
        expect(AppRegex.isEmailValid('test@gmail.com'), isTrue);
        expect(AppRegex.isEmailValid('user.name.tag@example.co.uk'), isTrue);
      });

      test('should return false for invalid emails', () {
        expect(AppRegex.isEmailValid('test@gmail'), isFalse);
        expect(AppRegex.isEmailValid('test'), isFalse);
        expect(AppRegex.isEmailValid('test@.com'), isFalse);
        expect(AppRegex.isEmailValid(''), isFalse);
      });
    });

    group('isPhoneNumberValid tests', () {
      test('should return true for valid Egyptian mobile numbers', () {
        expect(AppRegex.isPhoneNumberValid('01012345678'), isTrue);
        expect(AppRegex.isPhoneNumberValid('01187654321'), isTrue);
        expect(AppRegex.isPhoneNumberValid('01234567890'), isTrue);
        expect(AppRegex.isPhoneNumberValid('01599998888'), isTrue);
      });

      test('should return false for invalid mobile numbers', () {
        expect(AppRegex.isPhoneNumberValid('01312345678'), isFalse); // invalid prefix
        expect(AppRegex.isPhoneNumberValid('0101234567'), isFalse);  // too short
        expect(AppRegex.isPhoneNumberValid('010123456789'), isFalse); // too long
        expect(AppRegex.isPhoneNumberValid('abcdefghijk'), isFalse); // non-digits
        expect(AppRegex.isPhoneNumberValid(''), isFalse);
      });
    });

    group('isContainsNumber tests', () {
      test('should return true if string contains a digit', () {
        expect(AppRegex.isContainsNumber('pass123'), isTrue);
        expect(AppRegex.isContainsNumber('1'), isTrue);
      });

      test('should return false if string does not contain a digit', () {
        expect(AppRegex.isContainsNumber('password'), isFalse);
        expect(AppRegex.isContainsNumber(''), isFalse);
      });
    });

    group('isContainsCapitalLetter tests', () {
      test('should return true if string contains a capital letter', () {
        expect(AppRegex.isContainsCapitalLetter('Password'), isTrue);
        expect(AppRegex.isContainsCapitalLetter('A'), isTrue);
      });

      test('should return false if string does not contain a capital letter', () {
        expect(AppRegex.isContainsCapitalLetter('password'), isFalse);
        expect(AppRegex.isContainsCapitalLetter(''), isFalse);
      });
    });
  });
}
