import 'review_model.dart';

class AddReviewResponseModel {
  final String message;
  final ReviewModel? review;

  AddReviewResponseModel({required this.message, this.review});

  factory AddReviewResponseModel.fromJson(Map<String, dynamic> json) {
    // Try to find the review object in 'review', 'data', or directly in the response
    Map<String, dynamic>? reviewData;
    if (json['review'] != null) {
      reviewData = json['review'];
    } else if (json['data'] != null && json['data'] is Map<String, dynamic>) {
      reviewData = json['data'];
    }

    return AddReviewResponseModel(
      message: json['message'] ?? '',
      review: reviewData != null ? ReviewModel.fromJson(reviewData) : null,
    );
  }
}
