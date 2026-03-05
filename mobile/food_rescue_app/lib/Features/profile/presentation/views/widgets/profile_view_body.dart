import 'package:flutter/material.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/widgets/section_header.dart';
import 'account_auth_section.dart';
import 'general_settings_section.dart';
import 'my_activity_section.dart';
import 'profile_image_with_name.dart';
import 'state_row.dart';

class ProfileViewBody extends StatelessWidget {
  const ProfileViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: EdgeInsets.only(left: 20, right: 20),
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          CustomSliverAppBar(
            widget: Text(
              AppStrings.navProfile,
              style: AppTextStyles.appBarTitle,
            ),
          ),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),
                const ProfileImagaWithName(name: 'Abdelaziz sameh'),
                const SizedBox(height: 24),
                const StatesRow(),
                const SizedBox(height: 24),
                const SectionHeader(title: AppStrings.myActivity),
                const MyActivitySection(),
                const SizedBox(height: 24),
                const SectionHeader(title: AppStrings.general),
                const GeneralSettingsSection(),
                const SizedBox(height: 32),
                const AccountAuthSection(),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
