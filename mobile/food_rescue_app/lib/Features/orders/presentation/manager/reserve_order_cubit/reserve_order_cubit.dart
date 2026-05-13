import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../domain/use_cases/reserve_order_usecase.dart';
import '../../../data/models/reserve_order_request_model.dart';
import 'reserve_order_state.dart';

class ReserveOrderCubit extends Cubit<ReserveOrderState> {
  final ReserveOrderUseCase reserveOrderUseCase;

  ReserveOrderCubit({required this.reserveOrderUseCase}) : super(ReserveOrderInitial());

  Future<void> reserveOrder(ReserveOrderRequestModel requestModel) async {
    emit(ReserveOrderLoading());
    var result = await reserveOrderUseCase.call(requestModel);
    result.fold(
      (failure) => emit(ReserveOrderFailure(failure.errorMessage)),
      (response) => emit(ReserveOrderSuccess(response)),
    );
  }
}
