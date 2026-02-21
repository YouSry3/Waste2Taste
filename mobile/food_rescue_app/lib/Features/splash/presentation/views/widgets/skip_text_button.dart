import 'package:flutter/material.dart';
import 'package:food_rescue_app/core/constants/app_colors.dart';

class SkipTextButton extends StatelessWidget {
  const SkipTextButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentGeometry.centerRight,
      child: Padding(
        padding: const EdgeInsetsGeometry.only(top: 50),
        child: TextButton(
          style: TextButton.styleFrom(foregroundColor: AppColors.textGray),
          onPressed: () {},
          child: Text('Skip'),
        ),
      ),
    );
  }
}
