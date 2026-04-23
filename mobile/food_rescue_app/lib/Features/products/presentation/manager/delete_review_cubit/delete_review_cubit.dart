import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/products/domain/use_cases/delete_review_usecase.dart';
import 'delete_review_state.dart';

class DeleteReviewCubit extends Cubit<DeleteReviewState> {
  final DeleteReviewUseCase deleteReviewUseCase;

  DeleteReviewCubit({required this.deleteReviewUseCase}) : super(DeleteReviewInitial());

  Future<void> deleteReview(int reviewId) async {
    emit(DeleteReviewLoading());
    final result = await deleteReviewUseCase.call(reviewId);
    result.fold(
      (failure) => emit(DeleteReviewFailure(failure.errorMessage)),
      (_) => emit(DeleteReviewSuccess("Review deleted successfully", reviewId)),
    );
  }
}
