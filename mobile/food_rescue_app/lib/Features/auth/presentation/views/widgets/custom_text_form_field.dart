import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class CustomTextFormField extends StatefulWidget {
  const CustomTextFormField({
    super.key,
    required this.hint,
    required this.icon,
    this.inputType = TextInputType.text,
    this.isPassword = false,
    this.controller,
    this.validator,
    this.obsecureText,
  });

  final String hint;
  final bool isPassword;
  final bool? obsecureText;
  final TextInputType inputType;
  final IconData icon;
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  @override
  State<CustomTextFormField> createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<CustomTextFormField> {
  final ValueNotifier<bool> showPassword = ValueNotifier(true);

  @override
  void dispose() {
    showPassword.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: showPassword,
      builder: (context, value, child) {
        return TextFormField(
          onTapOutside: (event) =>
              FocusManager.instance.primaryFocus?.unfocus(),
          controller: widget.controller,
          validator: widget.validator,
          keyboardType: widget.inputType,
          obscureText: widget.obsecureText ?? showPassword.value,
          style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            filled: true,
            fillColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08),

            hintText: widget.hint,
            hintStyle: AppTextStyles.body.copyWith(color: Colors.grey.shade500),
            prefixIcon: Icon(
              widget.icon,
              color: Colors.grey.shade600,
              size: 20,
            ),
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      showPassword.value
                          ? Icons.visibility
                          : Icons.visibility_off,
                      color: Colors.grey.shade600,
                      size: 20,
                    ),
                    onPressed: () {
                      showPassword.value = !showPassword.value;
                    },
                  )
                : null,
            border: customOutlineInputBorder(color: Colors.grey.shade400),
            enabledBorder: customOutlineInputBorder(
              color: Colors.grey.shade400,
            ),
            focusedBorder: customOutlineInputBorder(color: AppColors.primary),
            contentPadding: const EdgeInsets.symmetric(
              vertical: 16,
              horizontal: 16,
            ),
          ),
        );
      },
    );
  }

  OutlineInputBorder customOutlineInputBorder({required Color color}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: BorderSide(color: color, width: 2),
    );
  }
}
