import 'package:flutter/material.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/widgets/section_header.dart';
import 'account_auth_section.dart';
import 'general_settings_section.dart';
import 'my_activity_section.dart';
import 'user_info_section.dart';

class ProfileViewBody extends StatelessWidget {
  const ProfileViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.only(left: 20, right: 20),
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          CustomSliverAppBar(
            widget: Text(
              context.loc.navProfile,
              style: AppTextStyles.title(context),
            ),
          ),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const UserInfoSection(),
                const SizedBox(height: 24),
                SectionHeader(title: context.loc.myActivity),
                const MyActivitySection(),
                const SizedBox(height: 24),
                SectionHeader(title: context.loc.general),
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
