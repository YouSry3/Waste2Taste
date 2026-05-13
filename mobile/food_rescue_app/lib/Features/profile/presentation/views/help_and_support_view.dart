import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/profile/presentation/views/widgets/help_and_support_view_body.dart';
import '../../../../core/functions/setup_service_locator.dart';
import '../manager/send_support_request_cubit/send_support_request_cubit.dart';

class HelpAndSupportView extends StatelessWidget {
  const HelpAndSupportView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt.get<SendSupportRequestCubit>(),
      child: const Scaffold(body: HelpAndSupportViewBody()),
    );
  }
}
