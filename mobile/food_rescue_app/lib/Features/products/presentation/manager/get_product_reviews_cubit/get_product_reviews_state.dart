import 'package:equatable/equatable.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';

abstract class GetProductReviewsState extends Equatable {
  @override
  List<Object?> get props => [];
}

class GetProductReviewsInitial extends GetProductReviewsState {}

class GetProductReviewsLoading extends GetProductReviewsState {}

class GetProductReviewsSuccess extends GetProductReviewsState {
  final List<ReviewEntity> reviews;

  GetProductReviewsSuccess(this.reviews);

  @override
  List<Object?> get props => [reviews];
}

class GetProductReviewsFailure extends GetProductReviewsState {
  final String errorMessage;

  GetProductReviewsFailure(this.errorMessage);

  @override
  List<Object?> get props => [errorMessage];
}
