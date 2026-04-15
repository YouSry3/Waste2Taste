import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'pill_badge.dart';

class DiscountBadge extends StatelessWidget {
  const DiscountBadge({super.key, required this.discountPercentage});
  final String discountPercentage;

  @override
  Widget build(BuildContext context) {
    return PillBadge(
      color: AppColors.secondary,
      child: Text(
        "-$discountPercentage",
        style: AppTextStyles.label(context).copyWith(color: Colors.white, fontSize: 14),
      ),
    );
  }
}
