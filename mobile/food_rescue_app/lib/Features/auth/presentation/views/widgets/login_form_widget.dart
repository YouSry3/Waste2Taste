import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
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
          AuthInputLabel(text: context.loc.email),
          CustomTextFormField(
            hint: context.loc.emailHint,
            icon: LucideIcons.mail,
            inputType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 20),
          AuthInputLabel(text: context.loc.password),
          CustomTextFormField(
            hint: context.loc.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
