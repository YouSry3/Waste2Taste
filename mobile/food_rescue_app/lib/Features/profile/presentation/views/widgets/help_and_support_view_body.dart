import 'package:flutter/material.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
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
            AppStrings.helpSupport,
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
                const CustomGreetingSection(
                  title: AppStrings.howCanWeHelpYou,
                  subtitle: AppStrings.describeYourIssueOrFeedbackBelow,
                ),
                const SizedBox(height: 40),
                ProfileTextField(
                  label: "Subject",
                  controller: _subjectController,
                  hintText: "Briefly describe the issue",
                ),
                const SizedBox(height: 24),
                ProfileTextField(
                  label: "Description",
                  controller: _descriptionController,
                  hintText: "Provide more details...",
                  maxLines: 4,
                ),
                const SizedBox(height: 32),
                CustomElevatedButton(
                  text: AppStrings.submitReport,
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
