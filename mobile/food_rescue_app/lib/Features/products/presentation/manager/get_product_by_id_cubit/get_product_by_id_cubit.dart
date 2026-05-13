import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../domain/use_cases/get_product_by_id_usecase.dart';
import 'get_product_by_id_state.dart';

class GetProductByIdCubit extends Cubit<GetProductByIdState> {
  final GetProductByIdUsecase getProductByIdUsecase;

  GetProductByIdCubit(this.getProductByIdUsecase) : super(GetProductByIdInitial());

  Future<void> getProductById(String productId) async {
    emit(GetProductByIdLoading());
    var result = await getProductByIdUsecase.call(productId);
    result.fold(
      (failure) => emit(GetProductByIdFailure(failure.errorMessage)),
      (product) => emit(GetProductByIdSuccess(product)),
    );
  }
}
