import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:load_it/load_it.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/app_routes.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../data/models/reset_pass_request_model.dart';
import '../../../data/models/verify_email_request_model.dart';
import '../../manager/reset_new_password_cubit/reset_new_password_cubit.dart';

class ResetPasswordButtonBlocConsumer extends StatelessWidget {
  const ResetPasswordButtonBlocConsumer({
    super.key,
    required GlobalKey<FormState> formKey,
    required TextEditingController passController,
  }) : _formKey = formKey,
       _passController = passController;
  final GlobalKey<FormState> _formKey;
  final TextEditingController _passController;
  @override
  Widget build(BuildContext context) {
    final userData =
        GoRouter.of(context).state.extra as VerifyEmailRequestModel;

    return BlocConsumer<ResetNewPasswordCubit, ResetNewPasswordState>(
      listener: (context, state) {
        if (state is ResetNewPasswordFailureState) {
          return CustomSnackBar.show(
            context: context,
            message: state.errMessage,
            type: SnackBarType.info,
          );
        } else if (state is ResetNewPasswordSuccessState) {
          CustomSnackBar.show(
            context: context,
            message: state.message,
            type: SnackBarType.success,
          );
          context.go(AppRoutes.login);
        }
      },
      builder: (context, state) {
        var cubit = BlocProvider.of<ResetNewPasswordCubit>(context);
        return CustomElevatedButton(
          child: state is ResetNewPasswordLoadingState
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(
                  AppStrings.resetPassword,
                  style: AppTextStyles.button.copyWith(fontSize: 19),
                ),

          onPressed: () async {
            if (_formKey.currentState!.validate()) {
              var model = ResetPassRequestModel(
                email: userData.email,
                code: userData.code,
                newPassword: _passController.text.trim(),
              );

              await cubit.resetNewPassword(requestModel: model);
            } else {
              return;
            }
          },
        );
      },
    );
  }
}
