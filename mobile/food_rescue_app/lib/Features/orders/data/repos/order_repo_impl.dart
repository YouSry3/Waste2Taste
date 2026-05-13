import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../../core/errors/failure.dart';
import '../../domain/repos/order_repo.dart';
import '../data_sources/order_remote_data_source.dart';
import '../models/reserve_order_request_model.dart';
import '../models/reserve_order_response_model.dart';

class OrderRepoImpl extends OrderRepo {
  final OrderRemoteDataSource orderRemoteDataSource;

  OrderRepoImpl({required this.orderRemoteDataSource});

  @override
  Future<Either<Failure, ReserveOrderResponseModel>> reserveOrder(
    ReserveOrderRequestModel requestModel,
  ) async {
    try {
      var result = await orderRemoteDataSource.reserveOrder(requestModel);
      return Right(result);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      } else {
        return left(ServerFailure(errorMessage: e.toString()));
      }
    }
  }
}
