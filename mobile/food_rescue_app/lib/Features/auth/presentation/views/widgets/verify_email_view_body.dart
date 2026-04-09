import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'auth_footer_bloc_provider.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import 'custom_pinput.dart';
import 'verify_email_bloc_provider.dart';

class VerifyEmailViewBody extends StatefulWidget {
  const VerifyEmailViewBody({super.key});

  @override
  State<VerifyEmailViewBody> createState() => _VerifyEmailViewBodyState();
}

class _VerifyEmailViewBodyState extends State<VerifyEmailViewBody> {
  late TextEditingController _pinController;

  @override
  void initState() {
    _pinController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final email = GoRouter.of(context).state.extra as String;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CustomAuthIcon(
            icon: LucideIcons.shieldCheck,
            color: AppColors.secondary,
          ),
          const SizedBox(height: 32),
          const CustomGreetingSection(
            title: AppStrings.verifyEmail,
            subtitle: AppStrings.verifyEmailSubtitle,
          ),
          const SizedBox(height: 6),
          Text(
            email,
            style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 48),
          Center(
            child: CustomPinput(pinController: _pinController),
          ).animate().fadeIn(delay: 300.ms).moveY(begin: 20, end: 0),
          const SizedBox(height: 32),
          VerifyEmailBlocProvider(email: email, pinController: _pinController),
          const SizedBox(height: 24),
          AuthFooterBlocProvider(email: email),
        ],
      ),
    );
  }
}
