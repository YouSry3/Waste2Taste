import 'package:dartz/dartz.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import '../../Features/home/domain/entities/location_entity.dart';
import '../errors/failure.dart';

class LocationService {
  Future<Either<Failure, LocationEntity>> getCurrentLocation() async {
    try {
      if (!await Geolocator.isLocationServiceEnabled()) {
        return left(const ServerFailure(errorMessage: 'Location services are disabled.'));
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return left(const ServerFailure(errorMessage: 'Location permissions are denied.'));
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

      String formatAddress(Placemark? place) {
        if (place == null) return '';
        final parts = <String>[];
        if (place.subLocality != null && place.subLocality!.isNotEmpty) parts.add(place.subLocality!);
        if (place.locality != null && place.locality!.isNotEmpty && place.locality != place.subLocality) parts.add(place.locality!);
        if (parts.isEmpty && place.administrativeArea != null && place.administrativeArea!.isNotEmpty) parts.add(place.administrativeArea!);
        return parts.join(', ');
      }

      return right(LocationEntity(
        latitude: position.latitude,
        longitude: position.longitude,
        addressEn: formatAddress(enPlace),
        addressAr: formatAddress(arPlace),
      ));
    } catch (e) {
      return left(ServerFailure(errorMessage: e.toString()));
    }
  }
}
