import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/custom_snack_bar.dart';
import '../../../../../core/utils/translator.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../data/models/report_vendor_request.dart';
import '../../manager/report_vendor_cubit/report_vendor_cubit.dart';

class ReportVendorButtonBlocConsumer extends StatelessWidget {
  const ReportVendorButtonBlocConsumer({
    super.key,
    required GlobalKey<FormState> formKey,
    required this.vendorId,
    required TextEditingController subjectController,
    required TextEditingController descriptionController,
  }) : _formKey = formKey,
       _subjectController = subjectController,
       _descriptionController = descriptionController;

  final GlobalKey<FormState> _formKey;
  final String vendorId;
  final TextEditingController _subjectController;
  final TextEditingController _descriptionController;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ReportVendorCubit, ReportVendorState>(
      listener: (context, state) {
        var currentLocal = Localizations.localeOf(context);
        if (state is ReportVendorFailure) {
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
        } else if (state is ReportVendorSuccess) {
          CustomSnackBar.show(
            context: context,
            message: context.loc.reportSubmittedSuccessfully,
            type: SnackBarType.success,
          );
          context.pop();
        }
      },
      builder: (context, state) {
        return CustomElevatedButton(
          text: state is ReportVendorLoading ? null : context.loc.submitReport,
          child: state is ReportVendorLoading
              ? const BouncingDotsIndicator(color: AppColors.background)
              : null,
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              context.read<ReportVendorCubit>().reportVendor(
                request: ReportVendorRequest(
                  vendorId: vendorId,
                  type: _subjectController.text.trim(),
                  description: _descriptionController.text.trim(),
                ),
              );
            }
          },
        );
      },
    );
  }
}
