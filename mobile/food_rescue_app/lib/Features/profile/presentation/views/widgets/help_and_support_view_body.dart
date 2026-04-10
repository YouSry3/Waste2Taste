import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/widgets/custom_greeting_section.dart';
import 'profile_text_field.dart';

class HelpAndSupportViewBody extends StatefulWidget {
  const HelpAndSupportViewBody({super.key});

  @override
  State<HelpAndSupportViewBody> createState() => _HelpAndSupportViewBodyState();
}

class _HelpAndSupportViewBodyState extends State<HelpAndSupportViewBody> {
  late TextEditingController _subjectController;
  late TextEditingController _descriptionController;
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
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            context.loc.helpSupport,
            style: AppTextStyles.appBarTitle,
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsetsGeometry.all(16),
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
                ),
                const SizedBox(height: 24),
                ProfileTextField(
                  label: context.loc.description,
                  controller: _descriptionController,
                  hintText: context.loc.provideMoreDetails,
                  maxLines: 4,
                ),
                const SizedBox(height: 32),
                CustomElevatedButton(
                  text: context.loc.submitReport,
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
