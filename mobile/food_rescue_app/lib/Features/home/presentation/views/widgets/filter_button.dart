import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class FilterButton extends StatelessWidget {
  const FilterButton({super.key});

  void _openFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SizedBox(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _openFilterSheet(context),
      borderRadius: BorderRadius.circular(8),
      child: const Icon(
        LucideIcons.slidersHorizontal,
        color: AppColors.textGray,
        size: 20,
      ),
    );
  }
}
