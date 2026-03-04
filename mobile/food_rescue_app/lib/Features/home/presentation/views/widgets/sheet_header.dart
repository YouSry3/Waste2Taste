import 'package:flutter/material.dart';

import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_strings.dart';

class SheetHeader extends StatelessWidget {
  const SheetHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.writeReview,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        SizedBox(height: 8),
        Text(
          AppStrings.howWasYourExperience,
          style: TextStyle(color: Colors.grey, fontSize: 16),
        ),
      ],
    );
  }
}
