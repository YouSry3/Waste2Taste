import '../../../domain/entities/product_entity.dart';

sealed class GetProductsState {}

final class GetProductsInitialState extends GetProductsState {}

final class GetProductsLoadingState extends GetProductsState {}

final class GetProductsSuccessState extends GetProductsState {
  final List<ProductEntity> data;
  GetProductsSuccessState({required this.data});
}

final class GetProductsFailureState extends GetProductsState {
  final String errMessage;
  GetProductsFailureState({required this.errMessage});
}
