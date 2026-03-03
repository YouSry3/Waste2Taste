import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../constants/app_colors.dart';
import '../constants/app_text_styles.dart';

class CustomElevatedButton extends StatelessWidget {
  const CustomElevatedButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.bgColor
  });
  final String text;
  final VoidCallback? onPressed;
  final Color? bgColor;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            fixedSize: Size(MediaQuery.widthOf(context), 56),
            backgroundColor: bgColor ?? AppColors.primary,
            disabledBackgroundColor: AppColors.primary.withValues(alpha: .6),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 8,
            shadowColor: AppColors.primary.withValues(alpha: 0.4),
          ),
          child: Text(text, style: AppTextStyles.button.copyWith(fontSize: 19)),
        )
        .animate()
        .fadeIn(delay: 500.ms) // Reduced delay
        .scale(begin: const Offset(0.9, 0.9));
  }
}
