import 'package:equatable/equatable.dart';

class ReviewEntity extends Equatable {
  final int id;
  final double rating;
  final String comment;
  final String userName;
  final String userId;
  final String? userImageUrl;
  final DateTime createdAt;

  const ReviewEntity({
    required this.id,
    required this.rating,
    required this.comment,
    required this.userName,
    required this.userId,
    this.userImageUrl,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
    id,
    rating,
    comment,
    userName,
    userId,
    userImageUrl,
    createdAt,
  ];
}

final List<ReviewEntity> dummyReviews = List.generate(
  5,
  (index) => ReviewEntity(
    id: index,
    rating: 5,
    comment: 'This is a placeholder review for skeleton loading states.',
    userName: 'User Name',
    userId: index.toString(),
    createdAt: DateTime.now(),
  ),
);
