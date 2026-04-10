import 'package:flutter/material.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_regex.dart';
import 'custom_validation_row.dart';

class PasswordValidationGroup extends StatelessWidget {
  const PasswordValidationGroup({
    super.key,
    required this.passwordNotifier,
    required this.confirmPasswordNotifier,
  });

  final ValueNotifier<String> passwordNotifier;
  final ValueNotifier<String> confirmPasswordNotifier;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: passwordNotifier,
      builder: (context, pass, _) {
        return Column(
          children: [
            CustomValidationRow(
              text: context.loc.atLeast8Characters,
              isValid: passwordNotifier.value.length >= 8,
            ),
            const SizedBox(height: 8),
            CustomValidationRow(
              text: context.loc.containsANumber,
              isValid: AppRegex.isContainsNumber(pass),
            ),
            const SizedBox(height: 8),
            CustomValidationRow(
              text: context.loc.containsAnUppercaseLetter,
              isValid: AppRegex.isContainsCapitalLetter(pass),
            ),
            const SizedBox(height: 8),
            ValueListenableBuilder(
              valueListenable: confirmPasswordNotifier,
              builder: (context, confrimPass, child) {
                return CustomValidationRow(
                  text: context.loc.passwordsMatch,
                  isValid: pass == confrimPass && pass.isNotEmpty,
                );
              },
            ),
          ],
        );
      },
    );
  }
}
