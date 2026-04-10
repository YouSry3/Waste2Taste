import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import 'package:waste2taste/core/utils/translator.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../data/models/signup_request_params_model.dart';
import '../../manager/signup_cubit/signup_cubit.dart';

class SignupButtonBlocConsumer extends StatelessWidget {
  const SignupButtonBlocConsumer({
    super.key,
    required GlobalKey<FormState> formKey,
    required TextEditingController emailController,
    required TextEditingController passController,
    required TextEditingController fullNameController,
  }) : _formKey = formKey,
       _emailController = emailController,
       _passController = passController,
       _fullNameController = fullNameController;

  final GlobalKey<FormState> _formKey;
  final TextEditingController _emailController;
  final TextEditingController _passController;
  final TextEditingController _fullNameController;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<SignupCubit, SignupState>(
      builder: (context, state) {
        var cubit = BlocProvider.of<SignupCubit>(context);
        return CustomElevatedButton(
          child: state is SignupLoadingState
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(
                  context.loc.signup,
                  style: AppTextStyles.button.copyWith(fontSize: 19),
                ),
          onPressed: () async {
            if (_formKey.currentState!.validate()) {
              var model = SignupRequestModel(
                email: _emailController.text.trim(),
                password: _passController.text.trim(),
                name: _fullNameController.text.trim(),
              );

              await cubit.signup(requestModel: model);
            } else {
              return;
            }
          },
        );
      },
      listener: (BuildContext context, SignupState state) async {
        var currentLocal = Localizations.localeOf(context);
        if (state is SignupFailureState) {
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
        } else if (state is SignupSuccessState) {
          return CustomSnackBar.show(
            context: context,
            message: context.loc.accountCreatedSuccessfully,
            type: SnackBarType.success,
          );
        }
      },
    );
  }
}
