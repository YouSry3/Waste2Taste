import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class CustomValidationRow extends StatelessWidget {
  const CustomValidationRow({
    super.key,
    required this.text,
    required this.isValid,
  });
  final String text;
  final bool isValid;
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            color: isValid ? AppColors.primary : Colors.transparent,
            border: Border.all(
              color: isValid ? AppColors.primary : Colors.grey.shade400,
              width: 2,
            ),
            shape: BoxShape.circle,
          ),
          child: isValid
              ? const Icon(Icons.check, size: 12, color: Colors.white)
              : null,
        ),
        const SizedBox(width: 12),
        Text(
          text,
          style: AppTextStyles.body.copyWith(
            color: isValid ? AppColors.textDark : Colors.grey.shade500,
            fontWeight: isValid ? FontWeight.w600 : FontWeight.normal,
            fontSize: 15,
          ),
        ),
      ],
    );
  }
}
