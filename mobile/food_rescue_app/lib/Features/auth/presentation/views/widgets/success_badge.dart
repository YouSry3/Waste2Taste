import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class SuccessBadge extends StatelessWidget {
  const SuccessBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 96,
      height: 96,
      decoration: const BoxDecoration(
        color: AppColors.primary,
        shape: BoxShape.circle,
      ),
      child: const Icon(LucideIcons.checkCircle, color: Colors.white, size: 60),
    ).animate().scale(duration: 400.ms, curve: Curves.elasticOut);
  }
}
