class AddReviewModel {
  final String productId;
  final int rating;
  final String comment;

  const AddReviewModel({
    required this.productId,
    required this.rating,
    required this.comment,
  });

  Map<String, dynamic> toJson() {
    return {'productId': productId, 'rating': rating, 'comment': comment};
  }
}
