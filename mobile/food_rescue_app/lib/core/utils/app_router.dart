import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../Features/splash/domain/repos/onboarding_repo.dart';
import '../../Features/splash/presentation/manager/onboarding_cubit.dart';
import '../../Features/splash/presentation/views/onboarding_view.dart';
import '../../Features/splash/presentation/views/splash_view.dart';
import '../functions/setup_service_locator.dart';
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
        builder: (context, state) => BlocProvider(
          create: (BuildContext context) =>
              OnboardingCubit(onboardingRepo: getIt.get<OnboardingRepo>()),
          child: const OnboardingView(),
        ),
      ),
    ],
  );
}
