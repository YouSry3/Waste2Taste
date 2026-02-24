import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_strings.dart';
import 'auth_input_label.dart';
import 'custom_text_form_field.dart';

class LoginFormWidget extends StatefulWidget {
  const LoginFormWidget({super.key});

  @override
  State<LoginFormWidget> createState() => _LoginFormWidgetState();
}

class _LoginFormWidgetState extends State<LoginFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
