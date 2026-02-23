import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_text_styles.dart';

class CustomGreetingSection extends StatelessWidget {
  const CustomGreetingSection({
    super.key,
    required this.title,
    required this.subtitle,
  });
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyles.title.copyWith(fontSize: 33),
        ).animate().fadeIn(delay: 100.ms).moveY(begin: 20, end: 0),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: AppTextStyles.subtitle.copyWith(fontSize: 17),
        ).animate().fadeIn(delay: 200.ms).moveY(begin: 20, end: 0),
      ],
    );
  }
}
