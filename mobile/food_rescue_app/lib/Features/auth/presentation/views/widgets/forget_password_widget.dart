import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_routes.dart';

class ForgetPasswordWiget extends StatelessWidget {
  const ForgetPasswordWiget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        TextButton(
          onPressed: () => GoRouter.of(context).push(AppRoutes.forgetPassword),
          child: Text(
            context.loc.forgotPassword,
            style: AppTextStyles.label(context).copyWith(
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
