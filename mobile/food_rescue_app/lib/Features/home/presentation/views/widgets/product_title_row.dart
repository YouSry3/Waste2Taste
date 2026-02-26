import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'star_rating.dart';

class ProductTitleRow extends StatelessWidget {
  const ProductTitleRow({super.key, required this.title, required this.rating});
  final String title;
  final double rating;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            style: AppTextStyles.body.copyWith(
              fontSize: 18,
              color: AppColors.textDark,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        StarRating(rating: rating),
      ],
    );
  }
}
