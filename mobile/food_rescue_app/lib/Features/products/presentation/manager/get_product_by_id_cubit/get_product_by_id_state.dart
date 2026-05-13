import '../../../../home/domain/entities/product_entity.dart';

abstract class GetProductByIdState {}

class GetProductByIdInitial extends GetProductByIdState {}

class GetProductByIdLoading extends GetProductByIdState {}

class GetProductByIdSuccess extends GetProductByIdState {
  final ProductEntity product;
  GetProductByIdSuccess(this.product);
}

class GetProductByIdFailure extends GetProductByIdState {
  final String errorMessage;
  GetProductByIdFailure(this.errorMessage);
}
