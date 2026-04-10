import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import 'profile_avatar_picker.dart';
import 'profile_text_field.dart';

class EditProfileViewBody extends StatelessWidget {
  const EditProfileViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            context.loc.editProfile,
            style: AppTextStyles.appBarTitle,
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16, top: 150),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                ProfileAvatarPicker(),
                const SizedBox(height: 32),
                ProfileTextField(
                  label: context.loc.fullName,
                  initialValue: "John Doe",
                ),
                const SizedBox(height: 16),
                CustomElevatedButton(
                  text: context.loc.saveChanges,
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
