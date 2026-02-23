import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'custom_check_box.dart';

class ForgetPassAndRememberMe extends StatelessWidget {
  const ForgetPassAndRememberMe({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            const CustomCheckBox(),
            const SizedBox(width: 8),
            Text(
              AppStrings.rememberMe,
              style: AppTextStyles.body.copyWith(
                color: AppColors.textGray,
                fontSize: 15,
              ),
            ),
          ],
        ),
        TextButton(
          onPressed: () {},
          child: Text(
            AppStrings.forgotPassword,
            style: AppTextStyles.label.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 400.ms);
  }
}
