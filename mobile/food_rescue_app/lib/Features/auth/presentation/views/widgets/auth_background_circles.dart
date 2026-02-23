import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/widgets/circle_widget.dart';

class AuthBackgroundCircles extends StatelessWidget {
  const AuthBackgroundCircles({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: -100,
          right: -100,
          child: CircleWidget(
            size: 300,
            color: AppColors.primary.withValues(alpha: 0.05),
          ),
        ),
        Positioned(
          bottom: -50,
          left: -50,
          child: CircleWidget(
            size: 200,
            color: AppColors.secondary.withValues(alpha: 0.05),
          ),
        ),
      ],
    );
  }
}
