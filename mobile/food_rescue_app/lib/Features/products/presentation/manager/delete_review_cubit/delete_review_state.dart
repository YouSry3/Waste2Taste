abstract class DeleteReviewState {}

class DeleteReviewInitial extends DeleteReviewState {}

class DeleteReviewLoading extends DeleteReviewState {}

class DeleteReviewSuccess extends DeleteReviewState {
  final String message;
  final int reviewId;
  DeleteReviewSuccess(this.message, this.reviewId);
}

class DeleteReviewFailure extends DeleteReviewState {
  final String errorMessage;
  DeleteReviewFailure(this.errorMessage);
}
