import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class PriceDisplay extends StatelessWidget {
  const PriceDisplay({
    super.key,
    required this.price,
    required this.originalPrice,
  });
  final double price;
  final double originalPrice;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          "\$${price.toStringAsFixed(2)}",
          style: AppTextStyles.body.copyWith(
            fontSize: 20,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          "\$${originalPrice.toStringAsFixed(2)}",
          style: AppTextStyles.body.copyWith(
            fontSize: 14,
            decoration: TextDecoration.lineThrough,
            color: Colors.grey[400],
          ),
        ),
      ],
    );
  }
}
