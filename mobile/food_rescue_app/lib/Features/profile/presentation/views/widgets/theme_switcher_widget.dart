import 'package:animated_theme_switcher/animated_theme_switcher.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/cubits/theme_cubit/theme_cubit.dart';
import '../../../../../core/theme/app_theme.dart';

class ThemeSwicherWidget extends StatelessWidget {
  const ThemeSwicherWidget({super.key, required this.themeState});

  final ThemeState themeState;

  @override
  Widget build(BuildContext context) {
    return ThemeSwitcher(
      clipper: const ThemeSwitcherCircleClipper(),
      builder: (context) => Switch(
        value: themeState.themeMode == AppThemeMode.dark,
        onChanged: (_) {
          final brightness = ThemeModelInheritedNotifier.of(
            context,
          ).theme.brightness;

          final isDark = brightness == Brightness.light;

          ThemeSwitcher.of(context).changeTheme(
            theme: isDark ? AppTheme.dark : AppTheme.light,
            isReversed: isDark ? true : false,
          );

          context.read<ThemeCubit>().setTheme(
            isDark ? AppThemeMode.dark : AppThemeMode.light,
          );
        },

        activeThumbColor: AppColors.primary,
      ),
    );
  }
}
