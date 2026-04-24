import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/widgets/profile_text_field.dart';
import 'report_vendor_button_bloc_consumer.dart';

class ReportVendorViewBody extends StatefulWidget {
  const ReportVendorViewBody({super.key});

  @override
  State<ReportVendorViewBody> createState() => _ReportVendorViewBodyState();
}

class _ReportVendorViewBodyState extends State<ReportVendorViewBody> {
  late TextEditingController _subjectController;
  late TextEditingController _descriptionController;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  @override
  void initState() {
    _subjectController = TextEditingController();
    _descriptionController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _subjectController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vendorId = GoRouterState.of(context).extra as String;
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            context.loc.reportVendor,
            style: AppTextStyles.title(context),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  CustomGreetingSection(
                    title: context.loc.howCanWeHelpYou,
                    subtitle: context.loc.describeYourIssueBelow,
                  ),
                  const SizedBox(height: 40),
                  ProfileTextField(
                    label: context.loc.subject,
                    controller: _subjectController,
                    hintText: context.loc.brieflyDescribeTheIssue,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return context.loc.pleaseEnterSubject;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  ProfileTextField(
                    label: context.loc.description,
                    controller: _descriptionController,
                    hintText: context.loc.provideMoreDetails,
                    maxLines: 4,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return context.loc.pleaseEnterDescription;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 32),
                  ReportVendorButtonBlocConsumer(
                    formKey: _formKey,
                    vendorId: vendorId,
                    subjectController: _subjectController,
                    descriptionController: _descriptionController,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
