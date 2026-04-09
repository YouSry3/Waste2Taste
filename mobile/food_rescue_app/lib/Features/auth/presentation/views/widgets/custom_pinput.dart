import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class CustomPinput extends StatefulWidget {
  const CustomPinput({
    super.key,
    required this.pinController,
  });
  final TextEditingController pinController;
  @override
  State<CustomPinput> createState() => _CustomPinputState();
}

class _CustomPinputState extends State<CustomPinput> {
  final defaultPinTheme = PinTheme(
    width: 56,
    height: 56,
    textStyle: AppTextStyles.title.copyWith(fontSize: 21),
    decoration: BoxDecoration(
      color: AppColors.fieldGray.withValues(alpha: 0.5),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.transparent),
    ),
  );

  PinTheme get focusedPinTheme => defaultPinTheme.copyDecorationWith(
    border: Border.all(color: AppColors.primary),
    color: AppColors.background,
  );

  @override
  Widget build(BuildContext context) {
    return Pinput(
      controller: widget.pinController,
      length: 6,
      defaultPinTheme: defaultPinTheme,
      focusedPinTheme: focusedPinTheme,
    );
  }
}
