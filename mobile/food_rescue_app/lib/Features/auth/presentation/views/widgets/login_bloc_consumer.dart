import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import 'package:waste2taste/Features/auth/data/models/login_request_model.dart';
import 'package:waste2taste/Features/auth/presentation/manager/login_cubit/login_cubit.dart';
import 'package:waste2taste/core/utils/app_router.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/utils/translator.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';

class LoginBlocConsumer extends StatelessWidget {
  const LoginBlocConsumer({
    super.key,
    required GlobalKey<FormState> formKey,
    required TextEditingController emailController,
    required TextEditingController passController,
  }) : _formKey = formKey,
       _emailController = emailController,
       _passController = passController;

  final GlobalKey<FormState> _formKey;
  final TextEditingController _emailController;
  final TextEditingController _passController;
  @override
  Widget build(BuildContext context) {
    return BlocConsumer<LoginCubit, LoginState>(
      listener: (context, state) async {
        var currentLocal = Localizations.localeOf(context);
        if (state is LoginFailureState) {
          translateMessage(state.errMessage, currentLocal.languageCode).then((
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
        } else if (state is LoginSuccessState) {
          await context.read<GetUserLocationCubit>().getUserLocation();
          if (context.mounted) {
            CustomSnackBar.show(
              context: context,
              message: context.loc.loginSuccess,
              type: SnackBarType.success,
            );
          }
          AppRouter.login();
        }
      },
      builder: (context, state) {
        var cubit = BlocProvider.of<LoginCubit>(context);

        return CustomElevatedButton(
          child: state is LoginLoadingState
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(
                  context.loc.login,
                  style: AppTextStyles.button.copyWith(fontSize: 19),
                ),
          onPressed: () async {
            if (_formKey.currentState!.validate()) {
              var model = LoginRequestModel(
                email: _emailController.text.trim(),
                password: _passController.text.trim(),
              );

              await cubit.login(requestModel: model);
            } else {
              return;
            }
          },
        );
      },
    );
  }
}
