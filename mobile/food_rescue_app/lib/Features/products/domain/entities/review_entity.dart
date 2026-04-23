class ReviewEntity {
  final int id;
  final double rating;
  final String comment;
  final String userName;
  final String? userImageUrl;
  final DateTime createdAt;

  const ReviewEntity({
    required this.id,
    required this.rating,
    required this.comment,
    required this.userName,
    this.userImageUrl,
    required this.createdAt,
  });
}