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
      (failure) =>
          emit(GetProductsFailureState(errMessage: failure.errorMessage)),
      (success) => emit(GetProductsSuccessState(data: success)),
    );
  }

  void updateProductFavorite(String productId, bool isFavorite) {
    if (state is GetProductsSuccessState) {
      final currentState = state as GetProductsSuccessState;
      final updatedList = currentState.data.map((product) {
        if (product.id == productId) {
          return product.copyWith(isFavorite: isFavorite);
        }
        return product;
      }).toList();
      emit(GetProductsSuccessState(data: updatedList));
    }
  }

  bool isProductFavorite(String productId) {
    if (state is GetProductsSuccessState) {
      final product = (state as GetProductsSuccessState).data.firstWhere(
        (p) => p.id == productId,
        orElse: () => throw Exception('Product not found'),
      );
      return product.isFavorite;
    }
    return false;
  }
}
