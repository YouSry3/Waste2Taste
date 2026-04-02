import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../../../domain/use_cases/verify_email_usecase.dart';
import '../../manager/verify_email_cubit/verify_email_cubit.dart';
import 'verify_email_bloc_consumer.dart';

class VerifyEmailBlocProvider extends StatelessWidget {
  const VerifyEmailBlocProvider({
    super.key,
    required this.email,
    required TextEditingController pinController,
  }) : _pinController = pinController;

  final String email;
  final TextEditingController _pinController;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => VerifyEmailCubit(getIt.get<VerifyEmailUsecase>()),
      child: VerifyEmailBlocConsumer(
        email: email,
        pinController: _pinController,
      ),
    );
  }
}
