import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_routes.dart';

class ReviewsSection extends StatelessWidget {
  const ReviewsSection({super.key, required this.rating});
  final double rating;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(LucideIcons.star, size: 16, color: AppColors.secondary),
        const SizedBox(width: 4),
        Text("$rating", style: AppTextStyles.label(context)),
        const SizedBox(width: 6),
        TextButton(
          style: TextButton.styleFrom(padding: EdgeInsets.zero),
          onPressed: () => GoRouter.of(context).push(AppRoutes.productReviews),
          child: Text(
            context.loc.reviewsCount(234),
            style: AppTextStyles.body(context).copyWith(
              color: AppColors.textMuted(context),
              decoration: TextDecoration.underline,
              decorationColor: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
      ],
    );
  }
}
