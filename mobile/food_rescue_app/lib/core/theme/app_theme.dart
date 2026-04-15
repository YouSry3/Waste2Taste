import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

abstract class AppTheme {
  static ThemeData get light => ThemeData(
    brightness: Brightness.light,
    scaffoldBackgroundColor: AppColors.backgroundLight,
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: AppColors.surfaceLight,
      onTertiary: AppColors.background,
      onTertiaryContainer: AppColors.primary,
    ),
    textTheme: GoogleFonts.outfitTextTheme().apply(
      bodyColor: AppColors.textDarkLight,
      displayColor: AppColors.textDarkLight,
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith(
        (s) => s.contains(WidgetState.selected) ? AppColors.primary : null,
      ),
    ),
  );

  static ThemeData get dark => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.backgroundDark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: AppColors.surfaceDark,
      onTertiary: AppColors.background,
      onTertiaryContainer: AppColors.primaryDark,
    ),
    textTheme: GoogleFonts.outfitTextTheme().apply(
      bodyColor: AppColors.textDarkDark,
      displayColor: AppColors.textDarkDark,
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith(
        (s) => s.contains(WidgetState.selected) ? AppColors.primary : null,
      ),
    ),
  );
}
