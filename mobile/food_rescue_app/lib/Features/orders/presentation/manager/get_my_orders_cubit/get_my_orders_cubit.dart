import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/usecase/use_case.dart';
import '../../../domain/use_cases/get_my_orders_usecase.dart';
import 'get_my_orders_state.dart';

class GetMyOrdersCubit extends Cubit<GetMyOrdersState> {
  final GetMyOrdersUseCase getMyOrdersUseCase;

  GetMyOrdersCubit(this.getMyOrdersUseCase) : super(GetMyOrdersInitial());

  Future<void> getMyOrders() async {
    emit(GetMyOrdersLoading());
    var result = await getMyOrdersUseCase.call(NoParamImpl());
    result.fold(
      (failure) => emit(GetMyOrdersFailure(failure.errorMessage)),
      (orders) => emit(GetMyOrdersSuccess(orders)),
    );
  }
}
