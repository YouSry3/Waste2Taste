import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/app_routes.dart';
import 'auth_footer.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import 'custom_pinput.dart';

class VerifyEmailViewBody extends StatelessWidget {
  const VerifyEmailViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final email = GoRouter.of(context).state.extra as String;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CustomAuthIcon(
            icon: LucideIcons.shieldCheck,
            color: AppColors.secondary,
          ),
          const SizedBox(height: 32),
          const CustomGreetingSection(
            title: AppStrings.verifyEmail,
            subtitle: AppStrings.verifyEmailSubtitle,
          ),
          const SizedBox(height: 6),
          Text(
            email,
            style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 48),
          const Center(
            child: CustomPinput(),
          ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
          const SizedBox(height: 32),
          CustomElevatedButton(
            text: AppStrings.verify,
            onPressed: () => GoRouter.of(context).push(AppRoutes.resetPassword),
          ),
          const SizedBox(height: 24),
          AuthFooter(
            text1: AppStrings.didntReceiveCode,
            text2: AppStrings.resendCode,
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
