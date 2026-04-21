import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class AuthFooter extends StatelessWidget {
  const AuthFooter({
    super.key,
    required this.text1,
    required this.text2,
    required this.onTap,
  });
  final String text1;
  final String text2;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          text1,
          style: AppTextStyles.body(
            context,
          ).copyWith(color: AppColors.textGray),
        ),
        InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(3.0),
            child: Text(
              text2,
              style: AppTextStyles.subtitle(
                context,
              ).copyWith(fontWeight: FontWeight.bold, fontSize: 15),
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 700.ms);
  }
}
