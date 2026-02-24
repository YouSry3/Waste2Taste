import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_strings.dart';
import 'custom_auth_icon.dart';
import 'custom_greeting_section.dart';
import 'login_and_create_account_navigator.dart';
import 'signup_form_widget.dart';

class SignupViewBodyComponents extends StatelessWidget {
  const SignupViewBodyComponents({super.key});

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
            const CustomAuthIcon(icon: LucideIcons.user),
            const SizedBox(height: 32),
            const CustomGreetingSection(
              title: AppStrings.createAccount,
              subtitle: AppStrings.createAccountSubtitle,
            ),
            const SizedBox(height: 48),
            const SignupFormWidget(),
            const SizedBox(height: 16),
            LoginAndCreateAccountNavigator(
              text1: AppStrings.alreadyHaveAccount,
              text2: AppStrings.login,
              onTap: () => GoRouter.of(context).pop(),
            ),
          ],
        ),
      ),
    );
  }
}
