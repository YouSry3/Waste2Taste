import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_validations.dart';
import '../../../../auth/presentation/views/widgets/auth_input_label.dart';
import '../../../../auth/presentation/views/widgets/custom_text_form_field.dart';
import '../../../../auth/presentation/views/widgets/password_validation_group.dart';
import 'change_password_button_bloc_consumer.dart';

class ChangePasswordFormWidget extends StatefulWidget {
  const ChangePasswordFormWidget({super.key});

  @override
  State<ChangePasswordFormWidget> createState() => _ChangePasswordFormWidgetState();
}

class _ChangePasswordFormWidgetState extends State<ChangePasswordFormWidget> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late TextEditingController _oldPassController;
  late TextEditingController _newPassController;
  late TextEditingController _confirmPassController;
  late ValueNotifier<String> passwordNotifier;
  late ValueNotifier<String> confirmPasswordNotifier;

  @override
  void initState() {
    _oldPassController = TextEditingController();
    _newPassController = TextEditingController()
      ..addListener(() => passwordNotifier.value = _newPassController.text);
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
    _oldPassController.dispose();
    _newPassController.dispose();
    _confirmPassController.dispose();
    passwordNotifier.dispose();
    confirmPasswordNotifier.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AuthInputLabel(text: context.loc.oldPassword),
          CustomTextFormField(
            controller: _oldPassController,
            validator: (value) => AppValidations.validatePassword(context, value),
            hint: context.loc.passwordHint,
            icon: LucideIcons.lock,
            isPassword: true,
          ),
          const SizedBox(height: 20),
          AuthInputLabel(text: context.loc.newPassword),
          CustomTextFormField(
            controller: _newPassController,
            validator: (value) => AppValidations.validatePassword(context, value),
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
              _newPassController.text.trim(),
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
          ChangePasswordButtonBlocConsumer(
            formKey: _formKey,
            oldPassController: _oldPassController,
            newPassController: _newPassController,
            confirmPassController: _confirmPassController,
          ),
        ],
      ),
    );
  }
}
