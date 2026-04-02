import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import '../../../domain/use_cases/send_reset_password_code_usecase.dart';
import '../../manager/send_reset_password_code_cubit/send_reset_password_code_cubit.dart';
import 'auth_footer_bloc_consumer.dart';

class AuthFooterBlocProvider extends StatelessWidget {
  const AuthFooterBlocProvider({super.key, required this.email});

  final String email;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          SendResetPasswordCodeCubit(getIt.get<SendResetPasswordCodeUsecase>()),
      child: AuthFooterBlocConsumer(email: email),
    );
  }
}
