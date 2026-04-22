import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../domain/use_cases/get_products_usecase.dart';
import 'get_products_state.dart';

class GetProductsCubit extends Cubit<GetProductsState> {
  GetProductsCubit(this.getProductsUsecase) : super(GetProductsInitialState());
  final GetProductsUsecase getProductsUsecase;

  Future<void> getProducts() async {
    emit(GetProductsLoadingState());
    var result = await getProductsUsecase.call();
    result.fold(
      (failure) => emit(GetProductsFailureState(errMessage: failure.errorMessage)),
      (success) => emit(GetProductsSuccessState(data: success)),
    );
  }
}
