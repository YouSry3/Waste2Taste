import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class PriceColumn extends StatelessWidget {
  const PriceColumn({
    super.key,
    required this.label,
    required this.price,
    this.isOldPrice = false,
  });
  final String label;
  final double price;
  final bool isOldPrice;

  @override
  Widget build(BuildContext context) {
    final formattedPrice = "\$${price.toStringAsFixed(2)}";

    return Column(
      crossAxisAlignment: isOldPrice
          ? CrossAxisAlignment.start
          : CrossAxisAlignment.end,
      children: [
        Text(
          label,
          style: AppTextStyles.body.copyWith(
            fontSize: 12,
            color: AppColors.textGray,
          ),
        ),
        Text(
          formattedPrice,
          style: isOldPrice
              ? AppTextStyles.body.copyWith(
                  color: AppColors.textGray,
                  decoration: TextDecoration.lineThrough,
                )
              : AppTextStyles.title.copyWith(
                  fontSize: 28,
                  color: AppColors.primary,
                ),
        ),
      ],
    );
  }
}
