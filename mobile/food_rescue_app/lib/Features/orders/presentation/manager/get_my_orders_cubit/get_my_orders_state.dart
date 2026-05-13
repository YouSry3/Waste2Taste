import '../../../data/models/order_model.dart';

abstract class GetMyOrdersState {}

class GetMyOrdersInitial extends GetMyOrdersState {}

class GetMyOrdersLoading extends GetMyOrdersState {}

class GetMyOrdersSuccess extends GetMyOrdersState {
  final List<OrderModel> orders;

  GetMyOrdersSuccess(this.orders);
}

class GetMyOrdersFailure extends GetMyOrdersState {
  final String errorMessage;

  GetMyOrdersFailure(this.errorMessage);
}
