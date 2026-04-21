import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';

class RetryButton extends StatelessWidget {
  final VoidCallback onTap;
  const RetryButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child:
          Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
                    SizedBox(width: 8),
                    Text("Retry", style: TextStyle(color: Colors.white)),
                  ],
                ),
              )
              .animate(target: 1)
              .scaleXY(end: 0.94, duration: 120.ms)
              .then()
              .scaleXY(end: 1),
    );
  }
}
