import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/utils/app_routes.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import 'custom_greeting_section.dart';
import 'forget_pass_and_remember_me.dart';
import 'auth_footer.dart';
import 'login_form_widget.dart';

class LoginViewBodyComponents extends StatelessWidget {
  const LoginViewBodyComponents({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 40),
            const CustomAuthIcon(
              icon: LucideIcons.user,
              color: AppColors.primary,
            ),
            const SizedBox(height: 32),
            const CustomGreetingSection(
              title: AppStrings.welcome,
              subtitle: AppStrings.loginSubtitle,
            ),
            const SizedBox(height: 48),
            const LoginFormWidget(),
            const SizedBox(height: 16),
            const ForgetPassAndRememberMe(),
            const SizedBox(height: 32),
            CustomElevatedButton(
              text: AppStrings.login,
              onPressed: () =>
                  GoRouter.of(context).pushReplacement(AppRoutes.home),
            ),
            const SizedBox(height: 42),
            AuthFooter(
              text1: AppStrings.dontHaveAccount,
              text2: AppStrings.signup,
              onTap: () => GoRouter.of(context).push(AppRoutes.signup),
            ),
          ],
        ),
      ),
    );
  }
}
