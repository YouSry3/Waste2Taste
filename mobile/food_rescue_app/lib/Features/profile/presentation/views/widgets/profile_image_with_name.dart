import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'profile_image_widget.dart';

class ProfileImagaWithName extends StatelessWidget {
  const ProfileImagaWithName({super.key, required this.name});
  final String name;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ProfileImageWidget(name: name),
          const SizedBox(height: 8),
          Text(
            name,
            style: AppTextStyles.title.copyWith(
              fontSize: 22,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }
}
