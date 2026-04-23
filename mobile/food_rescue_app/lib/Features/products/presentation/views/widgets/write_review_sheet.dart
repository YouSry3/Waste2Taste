import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:load_it/load_it.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/utils/custom_snack_bar.dart';
import 'package:waste2taste/core/utils/translator.dart';
import 'package:waste2taste/core/widgets/custom_elevated_button.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/rating_stars.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_state.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/review_comment_text_field.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/review_container.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/sheet_handle.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/sheet_header.dart';

class WriteReviewSheet extends StatefulWidget {
  final String productId;
  const WriteReviewSheet({super.key, required this.productId});

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
    return BlocConsumer<AddReviewCubit, AddReviewState>(
      listener: (context, state) async {
        var currentLocal = Localizations.localeOf(context);
        if (state is AddReviewFailure) {
          translateMessage(state.errorMessage, currentLocal.languageCode).then((
            translatedMessage,
          ) {
            if (context.mounted) {
              CustomSnackBar.show(
                context: context,
                message: translatedMessage,
                type: SnackBarType.info,
              );
            }
          });
        } else if (state is AddReviewSuccess) {
          CustomSnackBar.show(
            context: context,
            message: state.response.message,
            type: SnackBarType.success,
          );

          if (context.mounted) {
            Navigator.pop(context);
          }
        }
      },
      builder: (context, state) {
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
              CustomElevatedButton(
                onPressed: state is AddReviewLoading
                    ? null
                    : () {
                        final String comment = _commentController.text.trim();

                        if (_rating.value > 0 && comment.isNotEmpty) {
                          final review = AddReviewModel(
                            productId: widget.productId,
                            rating: _rating.value,
                            comment: comment,
                          );
                          context.read<AddReviewCubit>().addReview(review);
                        } else if (_rating.value == 0) {
                          CustomSnackBar.show(
                            context: context,
                            message: context.loc.pleaseRateProduct,
                            type: SnackBarType.info,
                          );
                        } else {
                          CustomSnackBar.show(
                            context: context,
                            message: context.loc.pleaseWriteComment,
                            type: SnackBarType.info,
                          );
                        }
                      },
                child: state is AddReviewLoading
                    ? const BouncingDotsIndicator(color: AppColors.background)
                    : Text(
                        context.loc.submitReview,
                        style: AppTextStyles.button.copyWith(fontSize: 19),
                      ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }
}
