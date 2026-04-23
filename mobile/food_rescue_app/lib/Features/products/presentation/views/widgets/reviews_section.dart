import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_routes.dart';

class ReviewsSection extends StatelessWidget {
  const ReviewsSection({
    super.key,
    required this.rating,
    required this.totalReviews,
    required this.productId,
  });
  final double rating;
  final int totalReviews;
  final String productId;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(LucideIcons.star, size: 16, color: AppColors.secondary),
        const SizedBox(width: 4),
        Text(
          rating.toStringAsFixed(1),
          style: AppTextStyles.label(context),
        ),
        const SizedBox(width: 6),
        TextButton(
          style: TextButton.styleFrom(padding: EdgeInsets.zero),
          onPressed: () {
            final getReviewsCubit = context.read<GetProductReviewsCubit>();
            GoRouter.of(context).push(
              AppRoutes.productReviews,
              extra: {
                'rating': rating,
                'totalReviews': totalReviews,
                'productId': productId,
                'getReviewsCubit': getReviewsCubit,
              },
            );
          },
          child: Text(
            context.loc.reviewsCount(totalReviews),
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
