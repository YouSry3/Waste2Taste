import 'package:dartz/dartz.dart';
import '../../../../../core/errors/failure.dart';
import '../../data/models/reserve_order_request_model.dart';
import '../../data/models/reserve_order_response_model.dart';
import '../../data/models/order_model.dart';

abstract class OrderRepo {
  Future<Either<Failure, ReserveOrderResponseModel>> reserveOrder(ReserveOrderRequestModel requestModel);
  Future<Either<Failure, List<OrderModel>>> getMyOrders();
}
