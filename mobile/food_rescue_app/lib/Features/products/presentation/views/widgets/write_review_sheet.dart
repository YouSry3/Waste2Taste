import 'package:flutter/material.dart';
import '../../../../home/presentation/views/widgets/rating_stars.dart';
import 'review_comment_text_field.dart';
import 'review_container.dart';
import '../../../../home/presentation/views/widgets/sheet_handle.dart';
import '../../../../home/presentation/views/widgets/sheet_header.dart';
import '../../../../home/presentation/views/widgets/submit_review_button.dart';

class WriteReviewSheet extends StatefulWidget {
  const WriteReviewSheet({super.key});

  @override
  State<WriteReviewSheet> createState() => _WriteReviewSheetState();
}

class _WriteReviewSheetState extends State<WriteReviewSheet> {
  final ValueNotifier<int> _rating = ValueNotifier(0);
  final TextEditingController _commentController = TextEditingController();

  @override
  void dispose() {
    _rating.dispose();
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ReviewContainer(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SheetHandle(),
          const SizedBox(height: 24),
          const SheetHeader(),
          const SizedBox(height: 24),
          RatingStars(ratingNotifier: _rating),
          const SizedBox(height: 32),
          ReviewCommentField(controller: _commentController),
          const SizedBox(height: 24),
          SubmitReviewButton(
            ratingNotifier: _rating,
            onSubmit: () => Navigator.pop(context),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
