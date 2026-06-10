import 'package:flutter_test/flutter_test.dart';
import 'package:waste2taste/core/functions/calculate_distance.dart';

void main() {
  group('calculateDistance tests', () {
    test('should calculate the correct distance in kilometers between two points', () {
      // Cairo to Alexandria approx. coordinates
      // Cairo: 30.0444, 31.2357
      // Alexandria: 31.2001, 29.9187
      // Expected distance is roughly 180-220 km
      final distance = calculateDistance(30.0444, 31.2357, 31.2001, 29.9187);
      expect(distance, closeTo(180.0, 50.0));
    });

    test('should return 0 when start and end coordinates are identical', () {
      final distance = calculateDistance(30.0444, 31.2357, 30.0444, 31.2357);
      expect(distance, 0.0);
    });
  });
}
