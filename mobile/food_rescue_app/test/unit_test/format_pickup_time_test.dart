import 'package:flutter_test/flutter_test.dart';
import 'package:waste2taste/core/functions/format_pickup_time.dart';

void main() {
  group('formatPickupTime tests', () {
    test('should return formatted time for a valid ISO 8601 string', () {
      final result = formatPickupTime('2023-10-15T14:30:00Z');
      expect(result, isNotEmpty);
      expect(result, isNot(equals('2023-10-15T14:30:00Z')));
    });

    test('should return the original string if input is not a valid ISO 8601 string', () {
      expect(formatPickupTime('invalid-date-string'), 'invalid-date-string');
      expect(formatPickupTime(''), '');
    });
  });
}
