import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:food_rescue_app/core/constants/app_text_styles.dart';
import '../../../../../core/constants/app_colors.dart';

class SplashLogo extends StatelessWidget {
  const SplashLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Waste',
          style: AppTextStyles.logo.copyWith(color: AppColors.primary),
        ).animate().fadeIn(duration: 600.ms).moveY(begin: 20, end: 0),
        Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '2',
                  style: AppTextStyles.logo.copyWith(
                    color: AppColors.secondary,
                  ),
                ),
                Text(
                  'Taste',
                  style: AppTextStyles.logo.copyWith(color: AppColors.primary),
                ),
              ],
            )
            .animate()
            .fadeIn(delay: 300.ms, duration: 600.ms)
            .moveY(begin: 20, end: 0),
      ],
    );
  }
}
