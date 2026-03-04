import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';

class DescriptionSection extends StatelessWidget {
  const DescriptionSection({super.key, required this.description});
  final String description;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Description", style: AppTextStyles.label.copyWith(fontSize: 18)),
        const SizedBox(height: 8),
        Text(
          description.isEmpty
              ? "Fresh assorted vegetables. Organic & locally sourced."
              : description,
          style: AppTextStyles.body.copyWith(
            color: AppColors.textGray,
            fontSize: 15,
            height: 1.6,
          ),
        ),
      ],
    );
  }
}
