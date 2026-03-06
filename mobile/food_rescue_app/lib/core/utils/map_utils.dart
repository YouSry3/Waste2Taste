import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'custom_snack_bar.dart';

class MapUtils {
  static Future<void> openMaps(BuildContext context, LatLng destination) async {
    final url = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving',
    );
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      if (context.mounted) {
        CustomSnackBar.show(
          context,
          message: 'Could not open Google Maps.',
          isError: true,
        );
      }
    }
  }

  static double calculateDistance(LatLng start, LatLng end) {
    const double earthRadius = 6371.0; 

    double dLat = _toRadians(end.latitude - start.latitude);
    double dLon = _toRadians(end.longitude - start.longitude);

    double a =
        math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(start.latitude)) *
            math.cos(_toRadians(end.latitude)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);

    double c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));

    return earthRadius * c;
  }

  static double _toRadians(double degree) {
    return degree * math.pi / 180;
  }
}
