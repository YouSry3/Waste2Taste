import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class StarItem extends StatelessWidget {
  const StarItem({
    super.key,
    required this.index,
    required this.rating,
    required this.onTap,
  });

  final int index;
  final int rating;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final isSelected = index < rating;

    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Icon(
          LucideIcons.star,
          size: 40,
          color: isSelected ? AppColors.secondary : Colors.grey.shade300,
        ),
      ),
    );
  }
}
