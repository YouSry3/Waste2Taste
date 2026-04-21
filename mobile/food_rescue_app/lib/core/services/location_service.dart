import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

import '../../Features/home/domain/entities/location_entity.dart';

class LocationService {
  Future<LocationEntity?> getCurrentLocation() async {
    if (!await Geolocator.isLocationServiceEnabled()) return null;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      return null;
    }

    final position = await Geolocator.getCurrentPosition();

    await GeocodingPlatform.instance?.setLocaleIdentifier('en_US');
    final enPlacemarks = await placemarkFromCoordinates(
      position.latitude,
      position.longitude,
    );

    await GeocodingPlatform.instance?.setLocaleIdentifier('ar_EG');
    final arPlacemarks = await placemarkFromCoordinates(
      position.latitude,
      position.longitude,
    );

    final enPlace = enPlacemarks.firstOrNull;
    final arPlace = arPlacemarks.firstOrNull;

    return LocationEntity(
      latitude: position.latitude,
      longitude: position.longitude,
      addressEn: '${enPlace?.subLocality}, ${enPlace?.locality}',
      addressAr: '${arPlace?.subLocality}, ${arPlace?.locality}',
    );
  }
}
