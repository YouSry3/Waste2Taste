import 'package:flutter/material.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'custom_check_box.dart';

class TermsAndPolicy extends StatelessWidget {
  const TermsAndPolicy({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const CustomCheckBox(),
        const SizedBox(width: 8),
        Expanded(
          child: Wrap(
            children: [
              const Text("By signing up, you agree to the "),
              Text(AppStrings.termsOfService, style: AppTextStyles.linkPrimary),
              const Text(" and "),
              Text(AppStrings.privacyPolicy, style: AppTextStyles.linkPrimary),
              const Text("."),
            ],
          ),
        ),
      ],
    );
  }
}
