import 'package:flutter/material.dart';
import 'package:waste2taste/core/constants/app_strings.dart';
import '../../../../../core/constants/app_colors.dart';

class ReviewCommentField extends StatelessWidget {
  const ReviewCommentField({super.key, required this.controller});
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      maxLines: 4,
      decoration: InputDecoration(
        hintText: AppStrings.shareYourThoughts,
        filled: true,
        fillColor: AppColors.background,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.all(16),
      ),
    );
  }
}
