import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class AnimatedLeaf extends StatelessWidget {
  const AnimatedLeaf({
    super.key,
    required this.left,
    required this.top,
    required this.duration,
  });

  final double left;
  final double top;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: left,
      top: top,
      child: const Icon(LucideIcons.leaf, size: 100, color: AppColors.primary)
          .animate(onPlay: (c) => c.repeat(reverse: true))
          .fade(begin: .03, end: .07)
          .moveY(
            begin: 0,
            end: 20,
            duration: duration,
            curve: Curves.easeInOut,
          ),
    );
  }
}
