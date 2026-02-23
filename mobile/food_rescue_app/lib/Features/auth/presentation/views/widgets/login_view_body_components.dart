import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_strings.dart';
import 'custom_auth_icon.dart';
import 'custom_elevated_button.dart';
import 'custom_greeting_section.dart';
import 'forget_pass_and_remember_me.dart';
import 'login_and_create_account_navigator.dart';
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
            const CustomAuthIcon(icon: LucideIcons.user),
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
            CustomElevatedButton(text: AppStrings.login, onPressed: () {}),
            const SizedBox(height: 42),
            LoginAndCreateAccountNavigator(
              text1: AppStrings.dontHaveAccount,
              text2: AppStrings.signup,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}
