import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/functions/get_chars_of_the_name.dart';

class ProfileImageWidget extends StatelessWidget {
  const ProfileImageWidget({super.key, required this.name});

  final String name;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 4),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10),
        ],
      ),
      child: CircleAvatar(
        radius: 50,
        backgroundColor: AppColors.primary,
        child: Text(
          getFirstCharsOfTwoStings(name),
          style: AppTextStyles.title.copyWith(
            fontSize: 32,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
