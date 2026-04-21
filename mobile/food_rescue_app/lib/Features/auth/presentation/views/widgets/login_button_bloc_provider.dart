import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/functions/setup_service_locator.dart';
import '../../../domain/use_cases/login_usecase.dart';
import '../../manager/login_cubit/login_cubit.dart';
import 'login_bloc_consumer.dart';

class LoginButtonBlocProvider extends StatelessWidget {
  const LoginButtonBlocProvider({
    super.key,
    required this.formKey,
    required this.emailController,
    required this.passController,
  });
  final GlobalKey<FormState> formKey;
  final TextEditingController emailController;
  final TextEditingController passController;
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LoginCubit(getIt.get<LoginUsecase>()),
      child: LoginBlocConsumer(
        formKey: formKey,
        emailController: emailController,
        passController: passController,
      ),
    );
  }
}
