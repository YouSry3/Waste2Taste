import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:load_it/load_it.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/auth/presentation/manager/reset_password_cubit/reset_password_cubit.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/app_routes.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import 'auth_input_label.dart';
import 'custom_auth_icon.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import 'custom_text_form_field.dart';

class ForgetPasswordViewBody extends StatefulWidget {
  const ForgetPasswordViewBody({super.key});

  @override
  State<ForgetPasswordViewBody> createState() => _ForgetPasswordViewBodyState();
}

class _ForgetPasswordViewBodyState extends State<ForgetPasswordViewBody> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late TextEditingController _emailController;
  @override
  void initState() {
    _emailController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CustomAuthIcon(
              icon: LucideIcons.keyRound,
              color: AppColors.primary,
            ),
            const SizedBox(height: 32),
            const CustomGreetingSection(
              title: AppStrings.forgotPasswordTitle,
              subtitle: AppStrings.forgotPasswordSubtitle,
            ),
            const SizedBox(height: 48),
            const AuthInputLabel(text: AppStrings.email),
            CustomTextFormField(
              hint: AppStrings.emailHint,
              icon: LucideIcons.mail,
              controller: _emailController,
              obsecureText: false,
            ),
            const SizedBox(height: 32),
            BlocConsumer<ResetPasswordCubit, ResetPasswordState>(
              listener: (context, state) {
                if (state is ResetPasswordFailureState) {
                  return CustomSnackBar.show(
                    context: context,
                    message: state.errMessage,
                    type: SnackBarType.info,
                  );
                } else if (state is ResetPasswordSucessState) {
                  return CustomSnackBar.show(
                    context: context,
                    message: "Code sent successfully",
                    type: SnackBarType.success,
                  );
                }
              },
              builder: (context, state) {
                var cubit = BlocProvider.of<ResetPasswordCubit>(context);
                return CustomElevatedButton(
                  child: state is ResetPasswordLoadingState
                      ? const BouncingDotsIndicator(color: AppColors.background)
                      : Text(
                          AppStrings.sendCode,
                          style: AppTextStyles.button.copyWith(fontSize: 19),
                        ),
                  onPressed: () async {
                    String email = _emailController.text.trim();
                    if (_formKey.currentState!.validate()) {
                      await cubit.resetPassword(email: email);
                    }
                    if (context.mounted) {
                      GoRouter.of(
                        context,
                      ).push(AppRoutes.verifyEmail, extra: email);
                    }
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
