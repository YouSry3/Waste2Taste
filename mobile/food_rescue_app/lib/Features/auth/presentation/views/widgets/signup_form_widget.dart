import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/utils/app_validations.dart';
import 'auth_input_label.dart';
import 'custom_text_form_field.dart';
import 'password_validation_group.dart';
import 'signup_button_bloc_consumer.dart';

class SignupFormWidget extends StatefulWidget {
  const SignupFormWidget({super.key});

  @override
  State<SignupFormWidget> createState() => _SignupFormWidgetState();
}

class _SignupFormWidgetState extends State<SignupFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late TextEditingController _fullNameController;
  late TextEditingController _emailController;
  late TextEditingController _passController;
  late TextEditingController _confirmPassController;
  late ValueNotifier<String> passwordNotifier;
  late ValueNotifier<String> confirmPasswordNotifier;
  @override
  void initState() {
    _fullNameController = TextEditingController();
    _emailController = TextEditingController();
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
    _fullNameController.dispose();
    _emailController.dispose();
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
          const AuthInputLabel(text: AppStrings.fullName),
          CustomTextFormField(
            controller: _fullNameController,
            validator: (value) => AppValidations.validateName(value),
            hint: AppStrings.fullNameHint,
            icon: LucideIcons.user,
            inputType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.email),
          CustomTextFormField(
            validator: (value) => AppValidations.validateEmail(value),
            hint: AppStrings.emailHint,
            icon: LucideIcons.mail,
            inputType: TextInputType.emailAddress,
            controller: _emailController,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.password),
          CustomTextFormField(
            controller: _passController,
            validator: (value) => AppValidations.validatePassword(value),
            hint: AppStrings.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          const AuthInputLabel(text: AppStrings.confirmPassword),
          CustomTextFormField(
            controller: _confirmPassController,
            validator: (value) => AppValidations.validateConfirmPassword(
              value,
              _passController.text.trim(),
            ),
            hint: AppStrings.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          PasswordValidationGroup(
            confirmPasswordNotifier: confirmPasswordNotifier,
            passwordNotifier: passwordNotifier,
          ),
          const SizedBox(height: 32),
          SignupButtonBlocConsumer(
            formKey: _formKey,
            emailController: _emailController,
            passController: _passController,
            fullNameController: _fullNameController,
          ),
        ],
      ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
    );
  }
}
