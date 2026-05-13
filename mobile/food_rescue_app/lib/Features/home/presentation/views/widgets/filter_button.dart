import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class FilterButton extends StatelessWidget {
  const FilterButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(8),
      child: const Icon(
        LucideIcons.slidersHorizontal,
        color: AppColors.textGray,
        size: 20,
      ),
    );
  }
}
