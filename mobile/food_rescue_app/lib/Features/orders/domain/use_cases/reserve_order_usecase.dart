import 'package:dartz/dartz.dart';
import '../../../../../core/errors/failure.dart';
import '../../../../../core/usecase/use_case.dart';
import '../../data/models/reserve_order_request_model.dart';
import '../../data/models/reserve_order_response_model.dart';
import '../repos/order_repo.dart';

class ReserveOrderUseCase extends UseCase<ReserveOrderResponseModel, ReserveOrderRequestModel> {
  final OrderRepo orderRepo;

  ReserveOrderUseCase({required this.orderRepo});

  @override
  Future<Either<Failure, ReserveOrderResponseModel>> call(ReserveOrderRequestModel param) async {
    return await orderRepo.reserveOrder(param);
  }
}
