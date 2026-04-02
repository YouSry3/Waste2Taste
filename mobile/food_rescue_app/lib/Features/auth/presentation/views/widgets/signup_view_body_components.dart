import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/signup_usecase.dart';
import 'package:waste2taste/Features/auth/presentation/manager/signup_cubit/signup_cubit.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import 'auth_footer.dart';
import 'signup_form_widget.dart';

class SignupViewBodyComponents extends StatelessWidget {
  const SignupViewBodyComponents({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 40),
            const CustomAuthIcon(
              icon: LucideIcons.user,
              color: AppColors.primary,
            ),
            const SizedBox(height: 32),
            const CustomGreetingSection(
              title: AppStrings.createAccount,
              subtitle: AppStrings.createAccountSubtitle,
            ),
            const SizedBox(height: 48),
            BlocProvider(
              create: (context) => SignupCubit(getIt.get<SignupUsecase>()),
              child: const SignupFormWidget(),
            ),
            const SizedBox(height: 16),
            AuthFooter(
              text1: AppStrings.alreadyHaveAccount,
              text2: AppStrings.login,
              onTap: () => GoRouter.of(context).pop(),
            ),
          ],
        ),
      ),
    );
  }
}
