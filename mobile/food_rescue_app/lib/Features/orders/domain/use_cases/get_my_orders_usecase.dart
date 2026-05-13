import 'package:dartz/dartz.dart';
import '../../../../../core/errors/failure.dart';
import '../../../../../core/usecase/use_case.dart';
import '../../data/models/order_model.dart';
import '../repos/order_repo.dart';

class GetMyOrdersUseCase extends UseCase<List<OrderModel>, NoParam> {
  final OrderRepo orderRepo;

  GetMyOrdersUseCase({required this.orderRepo});

  @override
  Future<Either<Failure, List<OrderModel>>> call(NoParam param) async {
    return await orderRepo.getMyOrders();
  }
}
