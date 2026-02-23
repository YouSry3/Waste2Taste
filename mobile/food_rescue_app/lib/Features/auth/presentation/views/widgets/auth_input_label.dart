import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';

class AuthInputLabel extends StatelessWidget {
  const AuthInputLabel({required this.text, super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0, left: 4),
      child: Text(text, style: AppTextStyles.label),
    );
  }
}
