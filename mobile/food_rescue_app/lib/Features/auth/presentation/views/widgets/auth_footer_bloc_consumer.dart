import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/utils/translator.dart';
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
          text1: context.loc.didntReceiveCode,
          text2: context.loc.resendCode,
          onTap: () async => await cubit.resetPassword(email: email),
        );
      },
      listener: (context, state) {
        if (state is SendResetPasswordCodeFailureState) {
          var localLangCode = Localizations.localeOf(context).languageCode;
          translateMessage(state.errMessage, localLangCode).then((
            translatedMessage,
          ) {
            if (context.mounted) {
              CustomSnackBar.show(
                context: context,
                message: translatedMessage,
                type: SnackBarType.info,
              );
            }
          });
        } else if (state is SendResetPasswordCodeSucessState) {
          CustomSnackBar.show(
            context: context,
            message: context.loc.codeSentSuccessfully,
            type: SnackBarType.success,
          );
        }
      },
    );
  }
}
