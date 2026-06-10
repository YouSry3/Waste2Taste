import 'package:flutter_test/flutter_test.dart';
import 'package:waste2taste/core/functions/get_chars_of_the_name.dart';

void main() {
  group('getFirstCharsOfTwoStings tests', () {
    test('should return first letters of first two names capitalized', () {
      expect(getFirstCharsOfTwoStings('John Doe'), 'JD');
    });

    test('should trim leading and trailing spaces correctly', () {
      expect(getFirstCharsOfTwoStings('  Alice Smith  '), 'AS');
    });

    test('should return single initial for a single name', () {
      expect(getFirstCharsOfTwoStings('Bob'), 'B');
    });

    test('should return first two initials for three or more names', () {
      expect(getFirstCharsOfTwoStings('John Bob Doe'), 'JB');
    });

    test('should return "?" for empty or whitespace-only input', () {
      expect(getFirstCharsOfTwoStings(''), '?');
      expect(getFirstCharsOfTwoStings('   '), '?');
    });

    test('should handle mixed casing and capitalize the output', () {
      expect(getFirstCharsOfTwoStings('john doe'), 'JD');
      expect(getFirstCharsOfTwoStings('aB cD'), 'AC');
    });
  });
}
