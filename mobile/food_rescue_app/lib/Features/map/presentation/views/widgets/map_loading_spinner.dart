import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class MapLoadingSpinner extends StatelessWidget {
  const MapLoadingSpinner({super.key});

  @override
  Widget build(BuildContext context) {
    final textColor = Theme.of(
      context,
    ).colorScheme.onSurface.withValues(alpha: 0.6);

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withValues(alpha: 0.12),
                ),
                child: const Center(
                  child: SizedBox(
                    width: 36,
                    height: 36,
                    child: CircularProgressIndicator(strokeWidth: 3),
                  ),
                ),
              )
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scale(
                begin: const Offset(.85, .85),
                end: const Offset(1.15, 1.15),
                duration: 1500.ms,
              ),

          const SizedBox(height: 20),

          Text(
                "Finding your location...",
                style: AppTextStyles.body(
                  context,
                ).copyWith(color: textColor, fontSize: 14),
              )
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .fade(begin: .4, end: 1, duration: 1500.ms),
        ],
      ),
    );
  }
}
