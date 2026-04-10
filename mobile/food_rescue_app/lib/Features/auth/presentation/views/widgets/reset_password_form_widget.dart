import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_validations.dart';
import 'auth_input_label.dart';
import 'custom_text_form_field.dart';
import 'password_validation_group.dart';
import 'reset_pass_button_bloc_provider.dart';

class ResetPasswordFormWidget extends StatefulWidget {
  const ResetPasswordFormWidget({super.key});

  @override
  State<ResetPasswordFormWidget> createState() =>
      _ResetPasswordFormWidgetState();
}

class _ResetPasswordFormWidgetState extends State<ResetPasswordFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late TextEditingController _passController;
  late TextEditingController _confirmPassController;
  late ValueNotifier<String> passwordNotifier;
  late ValueNotifier<String> confirmPasswordNotifier;
  @override
  void initState() {
    _passController = TextEditingController()
      ..addListener(() => passwordNotifier.value = _passController.text);
    _confirmPassController = TextEditingController()
      ..addListener(
        () => confirmPasswordNotifier.value = _confirmPassController.text,
      );
    passwordNotifier = ValueNotifier("");
    confirmPasswordNotifier = ValueNotifier("");
    super.initState();
  }

  @override
  void dispose() {
    _passController.dispose();
    _confirmPassController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AuthInputLabel(text: context.loc.newPassword),
          CustomTextFormField(
            controller: _passController,
            validator: (value) =>
                AppValidations.validatePassword(context, value),
            hint: context.loc.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          AuthInputLabel(text: context.loc.confirmPassword),
          CustomTextFormField(
            controller: _confirmPassController,
            validator: (value) => AppValidations.validateConfirmPassword(
              context,
              value,
              _passController.text.trim(),
            ),
            hint: context.loc.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          PasswordValidationGroup(
            confirmPasswordNotifier: confirmPasswordNotifier,
            passwordNotifier: passwordNotifier,
          ),
          const SizedBox(height: 32),
          ResetPasswordButtonBlocProvider(
            formKey: _formKey,
            passController: _passController,
          ),
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
