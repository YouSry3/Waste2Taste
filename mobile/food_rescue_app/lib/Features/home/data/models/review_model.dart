class ReviewModel {
  final String name;
  final int rating;
  final String comment;
  final String date;

  const ReviewModel({
    required this.name,
    required this.rating,
    required this.comment,
    required this.date,
  });
  factory ReviewModel.fromMap(Map<String, dynamic> map) {
    return ReviewModel(
      name: map['name'] ?? '',
      rating: map['rating'] ?? 0,
      comment: map['comment'] ?? '',
      date: map['date'] ?? '',
    );
  }
}

const List<ReviewModel> reviews = [
  ReviewModel(
    name: "Sarah Ahmed",
    rating: 5,
    comment: "Fresh vegetables, great quality! Saved money and food waste.",
    date: "2 days ago",
  ),
  ReviewModel(
    name: "Mohamed Ali",
    rating: 4,
    comment: "Good deal, pickup was easy and fast.",
    date: "1 week ago",
  ),
  ReviewModel(
    name: "Layla Mahmoud",
    rating: 5,
    comment: "Excellent quality for the price.",
    date: "2 weeks ago",
  ),
];
