import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import 'package:waste2taste/Features/profile/presentation/manager/send_support_request_cubit/send_support_request_cubit.dart';
import 'package:waste2taste/Features/profile/presentation/manager/send_support_request_cubit/send_support_request_state.dart';
import 'package:waste2taste/core/utils/custom_snack_bar.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import '../../../../../core/widgets/profile_text_field.dart';

class HelpAndSupportViewBody extends StatefulWidget {
  const HelpAndSupportViewBody({super.key});

  @override
  State<HelpAndSupportViewBody> createState() => _HelpAndSupportViewBodyState();
}

class _HelpAndSupportViewBodyState extends State<HelpAndSupportViewBody> {
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
    return Form(
      key: _formKey,
      child: CustomScrollView(
        slivers: [
          CustomSliverAppBar(
            widget: Text(
              context.loc.helpSupport,
              style: AppTextStyles.title(context),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  CustomGreetingSection(
                    title: context.loc.howCanWeHelpYou,
                    subtitle: context.loc.describeYourIssueOrFeedbackBelow,
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
                  BlocConsumer<
                    SendSupportRequestCubit,
                    SendSupportRequestState
                  >(
                    listener: (context, state) {
                      if (state is SendSupportRequestSuccess) {
                        CustomSnackBar.show(
                          context: context,
                          message: context.loc.reportSubmittedSuccessfully,
                          type: SnackBarType.success,
                        );
                        _subjectController.clear();
                        _descriptionController.clear();
                      } else if (state is SendSupportRequestFailure) {
                        CustomSnackBar.show(
                          context: context,
                          message: state.errorMessage,
                          type: SnackBarType.error,
                        );
                      }
                    },
                    builder: (context, state) {
                      return CustomElevatedButton(
                        child: state is SendSupportRequestLoading
                            ? const BouncingDotsIndicator(
                                color: AppColors.background,
                              )
                            : Text(
                                context.loc.submitReport,
                                style: AppTextStyles.button,
                              ),

                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            context
                                .read<SendSupportRequestCubit>()
                                .sendSupportRequest(
                                  subject: _subjectController.text,
                                  description: _descriptionController.text,
                                );
                          }
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
