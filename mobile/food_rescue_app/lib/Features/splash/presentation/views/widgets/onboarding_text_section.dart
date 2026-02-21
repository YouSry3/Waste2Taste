import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_text_styles.dart';

class OnboardingTextSection extends StatelessWidget {
  final String title;
  final String description;

  const OnboardingTextSection({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          Text(title, textAlign: TextAlign.center, style: AppTextStyles.title),
          const SizedBox(height: 16),
          Text(
            description,
            textAlign: TextAlign.center,
            style: AppTextStyles.subtitle.copyWith(height: 1.5),
          ).animate().fadeIn(delay: 200.ms).moveY(begin: 20, end: 0),
        ],
      ),
    );
  }
}
