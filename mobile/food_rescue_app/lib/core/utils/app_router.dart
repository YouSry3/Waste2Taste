import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/Features/orders/presentation/views/order_confirmation_view.dart';
import '../../Features/auth/data/models/user_login_keys.dart';
import '../../Features/auth/domain/use_cases/send_reset_password_code_usecase.dart';
import '../../Features/auth/presentation/manager/send_reset_password_code_cubit/send_reset_password_code_cubit.dart';
import '../../Features/home/presentation/views/home_view.dart';
import '../../Features/auth/presentation/views/forget_password_view.dart';
import '../../Features/auth/presentation/views/login_view.dart';
import '../../Features/auth/presentation/views/reset_password_view.dart';
import '../../Features/auth/presentation/views/signup_view.dart';
import '../../Features/auth/presentation/views/verify_email_view.dart';
import '../../Features/home/presentation/views/all_product_view.dart';
import '../../Features/products/presentation/views/poduct_reviews_view.dart';
import '../../Features/products/presentation/views/product_details_view.dart';
import '../../Features/orders/presentation/views/orders_view.dart';
import '../../Features/orders/presentation/views/saved_orders_view.dart';
import '../../Features/profile/presentation/views/edit_profile_view.dart';
import '../../Features/profile/presentation/views/general_settings_view.dart';
import '../../Features/profile/presentation/views/help_and_support_view.dart';
import '../../Features/splash/domain/repos/onboarding_repo.dart';
import '../../Features/splash/presentation/manager/onboarding_cubit.dart';
import '../../Features/splash/presentation/views/onboarding_view.dart';
import '../../Features/splash/presentation/views/splash_view.dart';
import '../../Features/report/presentation/views/report_vendor_view.dart';
import '../database/flutter_secure_storage_service.dart';
import '../functions/setup_service_locator.dart';
import '../widgets/custom_bottom_navigation_bar.dart';
import 'app_routes.dart';

abstract class AppRouter {
  static final ValueNotifier<bool?> authNotifier = ValueNotifier(null);

  static GoRouter routerConfig = GoRouter(
    initialLocation: AppRoutes.splash,
    refreshListenable: authNotifier,
    redirect: (context, state) {
      if (authNotifier.value == null) return AppRoutes.splash;
      final bool isLoggedIn = authNotifier.value!;
      final String location = state.matchedLocation;
      final List<String> authRoutes = [
        AppRoutes.splash,
        AppRoutes.onboarding,
        AppRoutes.login,
        AppRoutes.signup,
        AppRoutes.verifyEmail,
        AppRoutes.forgetPassword,
        AppRoutes.resetPassword,
      ];
      final bool isAuthRoute = authRoutes.contains(location);
      if (isLoggedIn && isAuthRoute) return AppRoutes.homeNavigationBar;
      if (!isLoggedIn && !isAuthRoute) return AppRoutes.login;

      return null;
    },
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
        builder: (context, state) => BlocProvider(
          create: (context) => SendResetPasswordCodeCubit(
            getIt.get<SendResetPasswordCodeUsecase>(),
          ),
          child: const ForgetPasswordView(),
        ),
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
      GoRoute(
        path: AppRoutes.orderConfirmationView,
        builder: (context, state) => const OrderConfirmationView(),
      ),
      GoRoute(
        path: AppRoutes.homeNavigationBar,
        builder: (context, state) => const CustomBottomNavigationBar(),
      ),
      GoRoute(
        path: AppRoutes.ordersView,
        builder: (context, state) => const OrdersView(),
      ),
      GoRoute(
        path: AppRoutes.savedOrdersView,
        builder: (context, state) => const SavedOrdersView(),
      ),
      GoRoute(
        path: AppRoutes.editProfileView,
        builder: (context, state) => const EditProfileView(),
      ),
      GoRoute(
        path: AppRoutes.generalSettingsView,
        builder: (context, state) => const GeneralSettingsView(),
      ),
      GoRoute(
        path: AppRoutes.helpAndSupportView,
        builder: (context, state) => const HelpAndSupportView(),
      ),
      GoRoute(
        path: AppRoutes.reportVendorView,
        builder: (context, state) => const ReportVendorView(),
      ),
    ],
  );
  static Future<void> checkToken() async {
    UserLoginKeys? keys = await getIt
        .get<FlutterSecureStorageService>()
        .getAuthToken();
    authNotifier.value = keys != null;
  }

  static void login() => authNotifier.value = true;

  static void logout() => authNotifier.value = false;
}
