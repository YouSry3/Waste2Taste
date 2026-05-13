import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/domain/use_cases/get_favorite_products_usecase.dart';

part 'get_favorite_products_state.dart';

class GetFavoriteProductsCubit extends Cubit<GetFavoriteProductsState> {
  GetFavoriteProductsCubit(this.getFavoriteProductsUsecase) : super(GetFavoriteProductsInitial());

  final GetFavoriteProductsUsecase getFavoriteProductsUsecase;

  Future<void> getFavoriteProducts() async {
    emit(GetFavoriteProductsLoading());
    var result = await getFavoriteProductsUsecase.call();
    result.fold(
      (failure) => emit(GetFavoriteProductsFailure(errMessage: failure.errorMessage)),
      (success) => emit(GetFavoriteProductsSuccess(products: success)),
    );
  }
}
