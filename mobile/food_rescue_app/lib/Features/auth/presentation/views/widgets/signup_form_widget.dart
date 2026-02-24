import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:food_rescue_app/Features/auth/presentation/views/widgets/custom_elevated_button.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_strings.dart';
import 'auth_input_label.dart';
import 'custom_text_form_field.dart';
import 'custom_validation_row.dart';
import 'terms_and_policy.dart';

class SignupFormWidget extends StatefulWidget {
  const SignupFormWidget({super.key});

  @override
  State<SignupFormWidget> createState() => _LoginFormWidgetState();
}

class _LoginFormWidgetState extends State<SignupFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AuthInputLabel(text: AppStrings.fullName),
          CustomTextFormField(
            hint: AppStrings.fullNameHint,
            icon: LucideIcons.user,
            inputType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.email),
          CustomTextFormField(
            hint: AppStrings.emailHint,
            icon: LucideIcons.mail,
            inputType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.password),
          const CustomTextFormField(
            hint: AppStrings.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.confirmPassword),
          const CustomTextFormField(
            hint: AppStrings.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          CustomValidationRow(
            text: AppStrings.atLeast8Characters,
            isValid: false,
          ),
          const SizedBox(height: 8),
          CustomValidationRow(text: AppStrings.containsANumber, isValid: true),
          const SizedBox(height: 8),
          CustomValidationRow(
            text: AppStrings.containsAnUppercaseLetter,
            isValid: false,
          ),
          const SizedBox(height: 8),
          CustomValidationRow(text: AppStrings.passwordsMatch, isValid: true),
          const SizedBox(height: 24),
          const TermsAndPolicy(),
          const SizedBox(height: 32),
          CustomElevatedButton(text: AppStrings.signup, onPressed: () {}),
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
