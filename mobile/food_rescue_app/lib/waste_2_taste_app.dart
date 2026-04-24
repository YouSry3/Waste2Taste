import 'package:animated_theme_switcher/animated_theme_switcher.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/cubits/localization_cubit/localization_cubit.dart';
import 'package:waste2taste/core/l10n/app_localizations.dart';
import 'Features/home/domain/use_cases/get_profile_usecase.dart';
import 'Features/home/domain/use_cases/get_user_location_usecase.dart';
import 'Features/home/presentation/manager/get_profile_cubit/get_profile_cubit.dart';
import 'Features/home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';
import 'core/functions/setup_service_locator.dart';
import 'core/theme/app_theme.dart';
import 'core/cubits/theme_cubit/theme_cubit.dart';
import 'core/utils/app_router.dart';

class Waste2TasteApp extends StatelessWidget {
  const Waste2TasteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => ThemeCubit()),
        BlocProvider(create: (_) => LocalizationCubit()),
        BlocProvider(
          create: (context) =>
              GetUserLocationCubit(getIt.get<GetUserLocationUsecase>())
                ..getUserLocation(),
        ),
        BlocProvider(
          create: (context) =>
              GetProfileCubit(getIt.get<GetProfileUsecase>())..getProfile(),
        ),
      ],
      child: BlocBuilder<LocalizationCubit, LocalizationState>(
        builder: (context, localizationState) {
          return BlocBuilder<ThemeCubit, ThemeState>(
            builder: (context, state) {
              final isDark = state.themeMode == AppThemeMode.dark;
              return ThemeProvider(
                duration: Duration(seconds: 1),
                initTheme: isDark ? AppTheme.dark : AppTheme.light,
                builder: (context, theme) => MaterialApp.router(
                  title: "Waste2Taste",
                  theme: AppTheme.light,
                  darkTheme: AppTheme.dark,
                  themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
                  debugShowCheckedModeBanner: false,
                  routerConfig: AppRouter.routerConfig,
                  localizationsDelegates:
                      AppLocalizations.localizationsDelegates,
                  supportedLocales: AppLocalizations.supportedLocales,
                  locale: localizationState.locale,
                ),
              );
            },
          );
        },
      ),
    );
  }
}
