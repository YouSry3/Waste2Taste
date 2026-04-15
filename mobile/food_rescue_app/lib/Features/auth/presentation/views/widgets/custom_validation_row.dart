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
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 300),
      opacity: isValid ? 1 : 0.7,
      child: Row(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              color: isValid ? AppColors.primary : Colors.transparent,
              borderRadius: BorderRadius.circular(50),
              border: Border.all(
                color: isValid ? AppColors.primary : Colors.grey.shade400,
                width: 2,
              ),
            ),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: isValid
                  ? const Icon(
                      Icons.check,
                      key: ValueKey("check"),
                      size: 14,
                      color: Colors.white,
                    )
                  : const SizedBox(key: ValueKey("empty")),
            ),
          ),
          const SizedBox(width: 12),
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 300),
            style: AppTextStyles.body(context).copyWith(
              color: isValid ? Theme.of(context).colorScheme.onSurface : Colors.grey.shade500,
              fontWeight: isValid ? FontWeight.w600 : FontWeight.normal,
              fontSize: 15,
            ),
            child: Text(text),
          ),
        ],
      ),
    );
  }
}
