import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class AnimatedLeafLoader extends StatelessWidget {
  const AnimatedLeafLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Icon(
          LucideIcons.leaf,
          size: 32,
          color: AppColors.primary.withValues(alpha: 0.8),
        )
        .animate(onPlay: (controller) => controller.repeat())
        .rotate(duration: 2.seconds, curve: Curves.easeInOut)
        .scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.2, 1.2),
          duration: 1.seconds,
          curve: Curves.easeInOut,
        )
        .then()
        .scale(
          begin: const Offset(1.2, 1.2),
          end: const Offset(0.8, 0.8),
          duration: 1.seconds,
          curve: Curves.easeInOut,
        )
        .animate()
        .fadeIn(delay: 800.ms);
  }
}
