import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../splash/presentation/views/widgets/custom_animated_icon.dart';

class CustomAuthIcon extends StatelessWidget {
  const CustomAuthIcon({super.key, required this.icon});
  final IconData icon;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const CustomAnimatedIcon(
        icon: LucideIcons.user,
        size: 40,
        color: AppColors.primary,
      ),
    );
  }
}
