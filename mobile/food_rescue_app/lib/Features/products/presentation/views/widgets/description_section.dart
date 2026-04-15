import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class DescriptionSection extends StatelessWidget {
  const DescriptionSection({super.key, required this.description});
  final String description;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          context.loc.description,
          style: AppTextStyles.label(context).copyWith(fontSize: 18),
        ),
        const SizedBox(height: 8),
        Text(
          description,
          style: AppTextStyles.body(context).copyWith(
            color: AppColors.textMuted(context),
            fontSize: 15,
            height: 1.6,
          ),
        ),
      ],
    );
  }
}
