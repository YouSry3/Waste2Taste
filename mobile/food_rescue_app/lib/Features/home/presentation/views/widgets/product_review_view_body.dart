import 'package:flutter/material.dart';
import '../../../data/models/review_model.dart';
import 'review_item.dart';
import 'reviews_header.dart';

class ProductReviewsViewBody extends StatelessWidget {
  const ProductReviewsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        const ReviewsHeader(),
        SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) => ReviewItem(review: reviews[index]),
            childCount: reviews.length,
          ),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
      ],
    );
  }
}
