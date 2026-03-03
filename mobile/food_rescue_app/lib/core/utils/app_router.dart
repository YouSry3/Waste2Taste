import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/Features/home/presentation/views/product_details_view.dart';
import 'package:waste2taste/Features/home/presentation/views/reviews_view.dart';
import '../../Features/home/presentation/views/home_view.dart';
import '../../Features/auth/presentation/views/forget_password_view.dart';
import '../../Features/auth/presentation/views/login_view.dart';
import '../../Features/auth/presentation/views/reset_password_view.dart';
import '../../Features/auth/presentation/views/signup_view.dart';
import '../../Features/auth/presentation/views/verify_email_view.dart';
import '../../Features/home/presentation/views/all_product_view.dart';
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
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginView(),
      ),
      GoRoute(
        path: AppRoutes.signup,
        builder: (context, state) => const SignupView(),
      ),
      GoRoute(
        path: AppRoutes.verifyEmail,
        builder: (context, state) => const VerifyEmailView(),
      ),
      GoRoute(
        path: AppRoutes.forgetPassword,
        builder: (context, state) => const ForgetPasswordView(),
      ),
      GoRoute(
        path: AppRoutes.resetPassword,
        builder: (context, state) => const ResetPasswordView(),
      ),
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomeView(),
      ),
      GoRoute(
        path: AppRoutes.allProducts,
        builder: (context, state) => const AllProductsView(),
      ),
      GoRoute(
        path: AppRoutes.productDetails,
        builder: (context, state) => const ProductDetailsView(),
      ),
      GoRoute(
        path: AppRoutes.productReviews,
        builder: (context, state) => const ProductReviewsView(),
      ),
    ],
  );
}
