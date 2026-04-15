import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

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
        context.loc.savingsMessage(amount.toStringAsFixed(2)),
        textAlign: TextAlign.center,
        style: AppTextStyles.label(context).copyWith(
          color: AppColors.primary,
          fontSize: 12,
        ),
      ),
    );
  }
}
