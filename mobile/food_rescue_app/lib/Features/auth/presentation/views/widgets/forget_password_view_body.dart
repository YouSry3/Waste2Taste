import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/utils/app_routes.dart';
import 'auth_input_label.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import 'custom_greeting_section.dart';
import 'custom_text_form_field.dart';

class ForgetPasswordViewBody extends StatelessWidget {
  const ForgetPasswordViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CustomAuthIcon(
            icon: LucideIcons.keyRound,
            color: AppColors.primary,
          ),
          const SizedBox(height: 32),
          const CustomGreetingSection(
            title: AppStrings.forgotPasswordTitle,
            subtitle: AppStrings.forgotPasswordSubtitle,
          ),
          const SizedBox(height: 48),
          const AuthInputLabel(text: AppStrings.email),
          const CustomTextFormField(
            hint: AppStrings.emailHint,
            icon: LucideIcons.mail,
          ),
          const SizedBox(height: 32),
          CustomElevatedButton(
            text: AppStrings.sendCode,
            onPressed: () => GoRouter.of(context).push(AppRoutes.verifyEmail),
          ),
        ],
      ),
    );
  }
}
