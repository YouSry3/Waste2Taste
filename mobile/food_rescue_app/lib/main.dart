import 'package:flutter/material.dart';
import 'package:food_rescue_app/core/utils/app_router.dart';

void main() {
  runApp(const FoodRescueApp());
}

class FoodRescueApp extends StatelessWidget {
  const FoodRescueApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: AppRouter.routerConfig,
    );
  }
}
