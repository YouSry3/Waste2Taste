import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ReviewRatingBadge extends StatelessWidget {
  final int rating;

  const ReviewRatingBadge({super.key, required this.rating});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.orange.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.star, size: 14, color: Colors.orange),
          const SizedBox(width: 4),
          Text(
            rating.toString(),
            style: const TextStyle(color: Colors.orange, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
