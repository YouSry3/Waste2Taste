import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class SavingsBanner extends StatelessWidget {
  const SavingsBanner({super.key, required this.amount});
  final double amount;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: .1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        "💰 You save \$${amount.toStringAsFixed(2)} and help reduce food waste!",
        textAlign: TextAlign.center,
        style: AppTextStyles.label.copyWith(
          color: AppColors.primary,
          fontSize: 12,
        ),
      ),
    );
  }
}
