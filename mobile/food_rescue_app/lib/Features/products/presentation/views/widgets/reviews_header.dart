import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class ReviewsHeader extends StatelessWidget {
  final int? totalReviews;
  final double? rating;
  const ReviewsHeader({super.key, this.totalReviews, this.rating});

  @override
  Widget build(BuildContext context) {
    Map<String, dynamic>? data =
        GoRouterState.of(context).extra as Map<String, dynamic>?;

    var displayRating = rating ?? data?['rating'] ?? 0.0;
    var displayTotalReviews = totalReviews ?? data?['totalReviews'] ?? 0;

    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Row(
          children: [
            Text(
              displayRating.toStringAsFixed(1),
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: List.generate(
                    5,
                    (index) => Icon(
                      LucideIcons.star,
                      size: 18,
                      color: index < displayRating.round()
                          ? Colors.orange
                          : Colors.grey.shade300,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  context.loc.basedOnReviews(displayTotalReviews.toString()),
                  style: TextStyle(color: Colors.grey.shade500),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
