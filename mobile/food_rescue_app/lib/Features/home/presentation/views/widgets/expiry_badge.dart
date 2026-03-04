import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'pill_badge.dart';

class ExpiryBadge extends StatelessWidget {
  const ExpiryBadge({super.key, required this.expiryTime});
  final String expiryTime;

  @override
  Widget build(BuildContext context) {
    return PillBadge(
      color: Colors.white,
      child: Row(
        children: [
          const Icon(LucideIcons.clock, size: 15, color: AppColors.accent),
          const SizedBox(width: 4),
          Text(
            expiryTime,
            style: AppTextStyles.label.copyWith(
              color: AppColors.accent,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
