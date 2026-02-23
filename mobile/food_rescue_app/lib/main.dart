import 'package:flutter/material.dart';
import 'core/constants/app_colors.dart';
import 'core/functions/setup_service_locator.dart';
import 'core/utils/app_router.dart';

void main() {
  setupLocator();
  runApp(const Waste2TasteApp());
}

class Waste2TasteApp extends StatelessWidget {
  const Waste2TasteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      theme: ThemeData(scaffoldBackgroundColor: AppColors.background),
      debugShowCheckedModeBanner: false,
      routerConfig: AppRouter.routerConfig,
    );
  }
}
