import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/constants/app_colors.dart';
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
  final List<String> priorities = ['low', 'medium', 'high'];
  late ValueNotifier<String> _selectedPriority;
  late TextEditingController _descriptionController;
  late TextEditingController _issueController;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    _selectedPriority = ValueNotifier(priorities[1]);
    _descriptionController = TextEditingController();
    _issueController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _selectedPriority.dispose();
    _descriptionController.dispose();
    _issueController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final orderId = GoRouterState.of(context).extra as String;
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
                    label: context.loc.issueType,
                    controller: _issueController,
                    hintText: context.loc.brieflyDescribeTheIssue,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return context.loc.pleaseEnterSubject;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  Text(
                    context.loc.priority,
                    style: AppTextStyles.label(context),
                  ),
                  const SizedBox(height: 8),
                  ValueListenableBuilder<String>(
                    valueListenable: _selectedPriority,
                    builder: (context, selectedPriority, child) {
                      return DropdownButtonFormField<String>(
                        initialValue: selectedPriority,
                        hint: Text(context.loc.pleaseSelectPriority),
                        decoration: _buildInputDecoration(context),
                        items: priorities.map((priority) {
                          String label = '';
                          if (priority == 'low') label = context.loc.low;
                          if (priority == 'medium') label = context.loc.medium;
                          if (priority == 'high') label = context.loc.high;
                          return DropdownMenuItem(
                            value: priority,
                            child: Text(label),
                          );
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) {
                            _selectedPriority.value = value;
                          }
                        },
                        validator: (value) => value == null
                            ? context.loc.pleaseSelectPriority
                            : null,
                      );
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
                  ValueListenableBuilder<String>(
                    valueListenable: _selectedPriority,
                    builder: (context, selectedPriority, child) {
                      return ReportVendorButtonBlocConsumer(
                        formKey: _formKey,
                        orderId: orderId,
                        issueType: _issueController,
                        priority: selectedPriority,
                        descriptionController: _descriptionController,
                      );
                    },
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  InputDecoration _buildInputDecoration(BuildContext context) {
    return InputDecoration(
      hintStyle: AppTextStyles.subtitle(context).copyWith(fontSize: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(
          color: Theme.of(
            context,
          ).colorScheme.onSurface.withValues(alpha: 0.15),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(
          color: Theme.of(
            context,
          ).colorScheme.onSurface.withValues(alpha: 0.15),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: AppColors.primary),
      ),
      filled: true,
      fillColor: Theme.of(
        context,
      ).colorScheme.onSurface.withValues(alpha: 0.04),
      contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
    );
  }
}
