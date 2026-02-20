import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/constants/app_colors.dart';

class SplashLogo extends StatelessWidget {
  const SplashLogo({super.key});

  TextStyle _style(BuildContext context, Color color) => GoogleFonts.fredoka(
    textStyle: Theme.of(context).textTheme.displayLarge?.copyWith(
      fontSize: 56,
      fontWeight: FontWeight.bold,
      height: .9,
      color: color,
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Waste',
          style: _style(context, AppColors.primary),
        ).animate().fadeIn(duration: 600.ms).moveY(begin: 20, end: 0),
        Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('2', style: _style(context, AppColors.secondary)),
                Text('Taste', style: _style(context, AppColors.primary)),
              ],
            )
            .animate()
            .fadeIn(delay: 300.ms, duration: 600.ms)
            .moveY(begin: 20, end: 0),
      ],
    );
  }
}
