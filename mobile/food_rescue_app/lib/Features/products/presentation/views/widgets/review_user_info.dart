import 'package:flutter/material.dart';
import '../../../../home/data/models/review_model.dart';
import 'review_avatar.dart';
import 'review_rating_badge.dart';

class ReviewUserInfo extends StatelessWidget {
  final ReviewModel review;

  const ReviewUserInfo({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            ReviewAvatar(name: review.name),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  review.name,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  review.date,
                  style: TextStyle(color: Colors.grey.shade400, fontSize: 12),
                ),
              ],
            ),
          ],
        ),
        ReviewRatingBadge(rating: review.rating),
      ],
    );
  }
}
