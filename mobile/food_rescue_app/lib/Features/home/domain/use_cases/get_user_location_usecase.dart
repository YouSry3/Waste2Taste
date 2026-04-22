import 'package:dartz/dartz.dart';
import 'package:waste2taste/core/services/location_service.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../entities/location_entity.dart';

class GetUserLocationUsecase extends UseCase<LocationEntity, NoParam> {
  GetUserLocationUsecase({required this.locationService});
  final LocationService locationService;

  @override
  Future<Either<Failure, LocationEntity>> call([NoParam? param]) async =>
      await locationService.getCurrentLocation();
}
