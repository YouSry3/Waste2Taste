import 'package:food_rescue_app/Features/splash/presentation/views/onboarding_view.dart';
import 'package:food_rescue_app/Features/splash/presentation/views/splash_view.dart';
import 'package:go_router/go_router.dart';
import 'app_routes.dart';

abstract class AppRouter {
  static GoRouter routerConfig = GoRouter(
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashView(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingView(),
      ),
    ],
  );
}
