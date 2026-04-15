import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../../core/constants/app_colors.dart';

class MyLocationButton extends StatelessWidget {
  final VoidCallback onTap;

  const MyLocationButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child:
          Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: isDark ? AppColors.surfaceDark : Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.my_location_rounded, size: 22),
              )
              .animate()
              .scaleXY(begin: 1, end: 0.88, duration: 150.ms)
              .then()
              .scaleXY(end: 1),
    );
  }
}
