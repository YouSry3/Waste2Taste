import '../../domain/entities/review_entity.dart';

class ReviewModel extends ReviewEntity {
  const ReviewModel({
    required super.id,
    required super.rating,
    required super.comment,
    required super.userName,
    super.userImageUrl,
    required super.createdAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    final user = json['user'] ?? {};
    return ReviewModel(
      id: json['id'] ?? 0,
      rating: (json['rating'] ?? 0).toDouble(),
      comment: json['comment'] ?? '',
      userName: user['name'] ?? '',
      userImageUrl: user['imageUrl'],
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'rating': rating,
      'comment': comment,
      'user': {'name': userName, 'imageUrl': userImageUrl},
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
