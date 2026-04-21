import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/utils/app_validations.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'auth_input_label.dart';
import 'custom_text_form_field.dart';
import 'forget_password_widget.dart';
import 'login_button_bloc_provider.dart';

class LoginFormWidget extends StatefulWidget {
  const LoginFormWidget({super.key});

  @override
  State<LoginFormWidget> createState() => _LoginFormWidgetState();
}

class _LoginFormWidgetState extends State<LoginFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  @override
  void initState() {
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AuthInputLabel(text: context.loc.email),
          CustomTextFormField(
            validator: (value) => AppValidations.validateEmail(context, value),
            hint: context.loc.emailHint,
            icon: LucideIcons.mail,
            inputType: TextInputType.emailAddress,
            controller: _emailController,
            obsecureText: false,
          ),
          const SizedBox(height: 20),
          AuthInputLabel(text: context.loc.password),
          CustomTextFormField(
            validator: (value) =>
                AppValidations.validatePassword(context, value),
            hint: context.loc.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
            controller: _passwordController,
          ),
          const ForgetPasswordWiget(),
          const SizedBox(height: 16),
          LoginButtonBlocProvider(
            formKey: _formKey,
            emailController: _emailController,
            passController: _passwordController,
          ),
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
