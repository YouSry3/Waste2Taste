import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/functions/format_date.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';
import 'package:waste2taste/Features/products/presentation/manager/delete_review_cubit/delete_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/review_avatar.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/review_rating_badge.dart';

import '../../manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';

class ReviewUserInfo extends StatelessWidget {
  final ReviewEntity review;

  const ReviewUserInfo({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    final profileState = context.watch<GetProfileCubit>().state;
    String? currentUserName;
    if (profileState is GetProfileSuccessState) {
      currentUserName = profileState.userEntity.name;
    }

    final bool isOwner = currentUserName == review.userName;

    return Row(
      children: [
        ReviewAvatar(imageUrl: review.userImageUrl, name: review.userName),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                review.userName,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyles.label(context).copyWith(fontSize: 14),
              ),
              const SizedBox(height: 2),
              Text(
                formatDate(review.createdAt),
                style: AppTextStyles.body(
                  context,
                ).copyWith(color: AppColors.textMuted(context), fontSize: 12),
              ),
            ],
          ),
        ),
        ReviewRatingBadge(rating: review.rating.toInt()),
        if (isOwner) ...[
          PopupMenuButton<String>(
            icon: Icon(
              LucideIcons.moreVertical,
              size: 20,
              color: AppColors.textMuted(context),
            ),
            onSelected: (value) {
              if (value == 'delete') {
                _showDeleteConfirmation(context);
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    const Icon(LucideIcons.trash2, size: 18, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(
                      context.loc.delete,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(context.loc.deleteReview),
        content: Text(context.loc.deleteReviewConfirmation),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(context.loc.cancel),
          ),
          TextButton(
            onPressed: () {
              context.read<DeleteReviewCubit>().deleteReview(review.id);
              context.read<GetProductReviewsCubit>().deleteReviewLocally(
                review.id,
              );
              Navigator.pop(dialogContext);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text(
              context.loc.delete,
              style: const TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}
