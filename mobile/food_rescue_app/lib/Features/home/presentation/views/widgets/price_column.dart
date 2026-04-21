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
          style: AppTextStyles.body(
            context,
          ).copyWith(fontSize: 12, color: AppColors.textMuted(context)),
        ),
        Text(
          formattedPrice,
          style: isOldPrice
              ? AppTextStyles.body(context).copyWith(
                  color: AppColors.textMuted(context),

                  decoration: TextDecoration.lineThrough,
                  decorationColor: Theme.of(context).colorScheme.onSurface,
                )
              : AppTextStyles.title(
                  context,
                ).copyWith(fontSize: 28, color: AppColors.primary),
        ),
      ],
    );
  }
}
