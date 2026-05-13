import '../../../data/models/reserve_order_response_model.dart';

abstract class ReserveOrderState {}

class ReserveOrderInitial extends ReserveOrderState {}

class ReserveOrderLoading extends ReserveOrderState {}

class ReserveOrderSuccess extends ReserveOrderState {
  final ReserveOrderResponseModel response;

  ReserveOrderSuccess(this.response);
}

class ReserveOrderFailure extends ReserveOrderState {
  final String errorMessage;

  ReserveOrderFailure(this.errorMessage);
}
