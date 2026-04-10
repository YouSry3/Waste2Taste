import 'package:flutter/material.dart';
import 'package:waste2taste/core/l10n/app_localizations.dart';
import 'core/constants/app_colors.dart';
import 'core/utils/app_router.dart';

class Waste2TasteApp extends StatelessWidget {
  const Waste2TasteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: "Waste2Taste",
      theme: ThemeData(scaffoldBackgroundColor: AppColors.background),
      debugShowCheckedModeBanner: false,
      routerConfig: AppRouter.routerConfig,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      locale: Locale('ar'),
    );
  }
}
