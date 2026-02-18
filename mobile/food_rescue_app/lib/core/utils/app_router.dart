import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'app_routes.dart';

abstract class AppRouter {
  static GoRouter routerConfig = GoRouter(
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const Placeholder(),
      ),
    ],
  );
}
