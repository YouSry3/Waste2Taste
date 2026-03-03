import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';

class StatusMessage extends StatelessWidget {
  const StatusMessage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Order Confirmed!',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            color: AppColors.textDark,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2, end: 0),
        const SizedBox(height: 8),
        Text(
          'Thank you for saving food! 🌱',
          style: Theme.of(
            context,
          ).textTheme.bodyLarge?.copyWith(color: Colors.grey.shade600),
          textAlign: TextAlign.center,
        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2, end: 0),
      ],
    );
  }
}
