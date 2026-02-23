import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/widgets/custom_animated_icon.dart';

class CustomAuthIcon extends StatelessWidget {
  const CustomAuthIcon({super.key, required this.icon});
  final IconData icon;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: ColoredBox(
          color: AppColors.primary.withValues(alpha: 0.1),
          child: const SizedBox(
            width: 80,
            height: 80,
            child: CustomAnimatedIcon(
              icon: LucideIcons.user,
              size: 40,
              color: AppColors.primary,
            ),
          ),
        ),
      ),
    );
  }
}
