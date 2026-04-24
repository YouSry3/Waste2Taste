import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/functions/setup_service_locator.dart';
import '../manager/report_vendor_cubit/report_vendor_cubit.dart';
import 'widgets/report_vendor_view_body.dart';

class ReportVendorView extends StatelessWidget {
  const ReportVendorView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt.get<ReportVendorCubit>(),
      child: const Scaffold(body: ReportVendorViewBody()),
    );
  }
}
