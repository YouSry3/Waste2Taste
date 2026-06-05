import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';
import 'package:waste2taste/Features/products/domain/use_cases/get_product_reviews_usecase.dart';
import 'get_product_reviews_state.dart';

class GetProductReviewsCubit extends Cubit<GetProductReviewsState> {
  final GetProductReviewsUsecase getProductReviewsUsecase;

  GetProductReviewsCubit(this.getProductReviewsUsecase) : super(GetProductReviewsInitial());

  Future<void> getProductReviews(String productId) async {
    emit(GetProductReviewsLoading());
    final result = await getProductReviewsUsecase.call(productId);
    result.fold(
      (failure) => emit(GetProductReviewsFailure(failure.errorMessage)),
      (reviews) => emit(GetProductReviewsSuccess(reviews)),
    );
  }

  void addReviewLocally(ReviewEntity newReview) {
    if (state is GetProductReviewsSuccess) {
      final currentState = state as GetProductReviewsSuccess;
      final updatedReviews = List<ReviewEntity>.from(currentState.reviews)..insert(0, newReview);
      emit(GetProductReviewsSuccess(updatedReviews));
    }
  }

  void deleteReviewLocally(int reviewId) {
    if (state is GetProductReviewsSuccess) {
      final currentState = state as GetProductReviewsSuccess;
      final updatedReviews = List<ReviewEntity>.from(currentState.reviews)
        ..removeWhere((review) => review.id == reviewId);
      emit(GetProductReviewsSuccess(updatedReviews));
    }
  }
}
