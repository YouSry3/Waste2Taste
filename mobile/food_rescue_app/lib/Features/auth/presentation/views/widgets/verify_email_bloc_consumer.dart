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
import '../../../data/models/verify_email_request_model.dart';
import '../../manager/verify_email_cubit/verify_email_cubit.dart';

class VerifyEmailBlocConsumer extends StatelessWidget {
  const VerifyEmailBlocConsumer({
    super.key,
    required this.email,
    required this.pinController,
  });
  final String email;
  final TextEditingController pinController;
  @override
  Widget build(BuildContext context) {
    return BlocConsumer<VerifyEmailCubit, VerifyEmailState>(
      listener: (BuildContext context, VerifyEmailState state) {
        if (state is VerifyEmailFailureState) {
          return CustomSnackBar.show(
            context: context,
            message: state.errMessage,
            type: SnackBarType.info,
          );
        } else if (state is VerifyEmailSuccessState) {
          return CustomSnackBar.show(
            context: context,
            message: "Correct Code",
            type: SnackBarType.success,
          );
        }
      },
      builder: (context, state) {
        var cubit = BlocProvider.of<VerifyEmailCubit>(context);
        return CustomElevatedButton(
          child: state is VerifyEmailLoadingState
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(
                  AppStrings.verify,
                  style: AppTextStyles.button.copyWith(fontSize: 19),
                ),
          onPressed: () async {
            var model = VerifyEmailRequestModel(
              email: email,
              code: pinController.text,
            );
            await cubit.verifyEmail(requestModel: model);
            if (context.mounted) {
              GoRouter.of(
                context,
              ).push(AppRoutes.resetPassword, extra: model);
            }
          },
        );
      },
    );
  }
}
