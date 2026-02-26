import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import 'custom_auth_icon.dart';
import 'custom_greeting_section.dart';
import 'reset_password_form_widget.dart';

class ResetPasswordViewBody extends StatelessWidget {
  const ResetPasswordViewBody({super.key});

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
              title: AppStrings.resetPassword,
              subtitle: AppStrings.resetPasswordSubtitle,
            ),
            const SizedBox(height: 48),
            const ResetPasswordFormWidget(),
          ],
        ),
      ),
    );
  }
}
