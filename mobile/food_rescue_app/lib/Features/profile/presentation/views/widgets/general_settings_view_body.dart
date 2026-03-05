import 'package:flutter/material.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import 'danger_section.dart';
import 'general_section.dart';
import 'security_section.dart';

class GeneralSettingsViewBody extends StatelessWidget {
  const GeneralSettingsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            AppStrings.generalSettings,
            style: AppTextStyles.appBarTitle,
          ),
        ),
        const SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                GeneralSection(),
                SizedBox(height: 24),
                SecuritySection(),
                SizedBox(height: 24),
                DangerSection(),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
