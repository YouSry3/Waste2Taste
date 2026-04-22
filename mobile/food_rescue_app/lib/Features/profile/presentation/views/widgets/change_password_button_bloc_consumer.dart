import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:load_it/load_it.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/utils/translator.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../profile/data/models/change_password_request_model.dart';
import '../../manager/change_password_cubit/change_password_cubit.dart';

class ChangePasswordButtonBlocConsumer extends StatelessWidget {
  const ChangePasswordButtonBlocConsumer({
    super.key,
    required GlobalKey<FormState> formKey,
    required TextEditingController oldPassController,
    required TextEditingController newPassController,
    required TextEditingController confirmPassController,
  }) : _formKey = formKey,
       _oldPassController = oldPassController,
       _newPassController = newPassController,
       _confirmPassController = confirmPassController;

  final GlobalKey<FormState> _formKey;
  final TextEditingController _oldPassController;
  final TextEditingController _newPassController;
  final TextEditingController _confirmPassController;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ChangePasswordCubit, ChangePasswordState>(
      builder: (context, state) {
        var cubit = BlocProvider.of<ChangePasswordCubit>(context);
        return CustomElevatedButton(
          onPressed: state is ChangePasswordLoading
              ? null
              : () async {
                  if (_formKey.currentState!.validate()) {
                    var model = ChangePasswordRequestModel(
                      oldPassword: _oldPassController.text.trim(),
                      newPassword: _newPassController.text.trim(),
                      confirmPassword: _confirmPassController.text.trim(),
                    );

                    await cubit.changePassword(requestModel: model);
                  } else {
                    return;
                  }
                },
          child: state is ChangePasswordLoading
              ? const BouncingDotsIndicator(color: AppColors.background)
              : Text(
                  context.loc.changePassword,
                  style: AppTextStyles.button.copyWith(fontSize: 19),
                ),
        );
      },
      listener: (BuildContext context, ChangePasswordState state) async {
        var currentLocal = Localizations.localeOf(context);
        if (state is ChangePasswordFailure) {
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
        } else if (state is ChangePasswordSuccess) {
          CustomSnackBar.show(
            context: context,
            message: context.loc.passwordChangedSuccessfully,
            type: SnackBarType.success,
          );
          GoRouter.of(context).pop();
        }
      },
    );
  }
}
