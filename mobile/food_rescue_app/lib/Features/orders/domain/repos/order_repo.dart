import 'package:dartz/dartz.dart';
import '../../../../../core/errors/failure.dart';
import '../../data/models/reserve_order_request_model.dart';
import '../../data/models/reserve_order_response_model.dart';

abstract class OrderRepo {
  Future<Either<Failure, ReserveOrderResponseModel>> reserveOrder(ReserveOrderRequestModel requestModel);
}
