import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../../../domain/use_cases/reset_pass_usecase.dart';
import '../../manager/reset_new_password_cubit/reset_new_password_cubit.dart';
import 'reset_pass_button_bloc_consumer.dart';

class ResetPasswordButtonBlocProvider extends StatelessWidget {
  const ResetPasswordButtonBlocProvider({
    super.key,
    required this.formKey,
    required this.passController,
  });
  final GlobalKey<FormState> formKey;
  final TextEditingController passController;
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ResetNewPasswordCubit(getIt.get<ResetPassUsecase>()),
      child: ResetPasswordButtonBlocConsumer(
        formKey: formKey,
        passController: passController,
      ),
    );
  }
}
