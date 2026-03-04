import 'package:flutter/material.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../../../core/widgets/custom_elevated_button.dart';

class SubmitReviewButton extends StatelessWidget {
  final ValueNotifier<int> ratingNotifier;
  final VoidCallback onSubmit;

  const SubmitReviewButton({
    super.key,
    required this.ratingNotifier,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: ratingNotifier,
      builder: (context, rating, _) {
        return CustomElevatedButton(
          text: AppStrings.submitReview,
          onPressed: rating > 0 ? onSubmit : null,
        );
      },
    );
  }
}
