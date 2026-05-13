part of 'get_favorite_products_cubit.dart';

abstract class GetFavoriteProductsState {}

class GetFavoriteProductsInitial extends GetFavoriteProductsState {}

class GetFavoriteProductsLoading extends GetFavoriteProductsState {}

class GetFavoriteProductsSuccess extends GetFavoriteProductsState {
  final List<ProductEntity> products;
  GetFavoriteProductsSuccess({required this.products});
}

class GetFavoriteProductsFailure extends GetFavoriteProductsState {
  final String errMessage;
  GetFavoriteProductsFailure({required this.errMessage});
}
