import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../manager/send_reset_password_code_cubit/send_reset_password_code_cubit.dart';
import 'auth_footer.dart';

class AuthFooterBlocConsumer extends StatelessWidget {
  const AuthFooterBlocConsumer({super.key, required this.email});

  final String email;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<SendResetPasswordCodeCubit, SendResetPasswordCodeState>(
      builder: (context, state) {
        if (state is SendResetPasswordCodeLoadingState) {
          return const Center(
            child: BouncingDotsIndicator(color: AppColors.primary),
          );
        }
        var cubit = BlocProvider.of<SendResetPasswordCodeCubit>(context);
        return AuthFooter(
          text1: AppStrings.didntReceiveCode,
          text2: AppStrings.resendCode,
          onTap: () async => await cubit.resetPassword(email: email),
        );
      },
      listener: (context, state) {
        if (state is SendResetPasswordCodeFailureState) {
          return CustomSnackBar.show(
            context: context,
            message: state.errMessage,
            type: SnackBarType.info,
          );
        } else if (state is SendResetPasswordCodeSucessState) {
          return CustomSnackBar.show(
            context: context,
            message: "Code sent successfully",
            type: SnackBarType.success,
          );
        }
      },
    );
  }
}
