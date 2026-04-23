import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waste2taste/Features/products/domain/entities/review_entity.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_state.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_state.dart';
import 'package:waste2taste/Features/products/presentation/manager/delete_review_cubit/delete_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/delete_review_cubit/delete_review_state.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/review_item.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/reviews_header.dart';

class ProductReviewsViewBody extends StatelessWidget {
  const ProductReviewsViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<AddReviewCubit, AddReviewState>(
          listener: (context, state) {
            if (state is AddReviewSuccess) {
              if (state.response.review != null) {
                context.read<GetProductReviewsCubit>().addReviewLocally(
                  state.response.review!,
                );
              } else {
                _refreshReviews(context);
              }
            }
          },
        ),
        BlocListener<DeleteReviewCubit, DeleteReviewState>(
          listener: (context, state) {
            if (state is DeleteReviewSuccess) {
              context.read<GetProductReviewsCubit>().deleteReviewLocally(
                state.reviewId,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.green,
                ),
              );
            } else if (state is DeleteReviewFailure) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.errorMessage),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
        ),
      ],
      child: BlocBuilder<GetProductReviewsCubit, GetProductReviewsState>(
        builder: (context, state) {
          final bool isLoading = state is GetProductReviewsLoading;
          final List<ReviewEntity> reviews = state is GetProductReviewsSuccess
              ? state.reviews
              : dummyReviews;

          double averageRating = 0.0;
          int totalCount = reviews.length;

          if (state is GetProductReviewsSuccess && reviews.isNotEmpty) {
            double sum = 0.0;
            for (var review in reviews) {
              sum += review.rating;
            }
            averageRating = sum / reviews.length;
            totalCount = reviews.length;
          }

          return Skeletonizer(
            enabled: isLoading,
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                ReviewsHeader(totalReviews: totalCount, rating: averageRating),
                SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final review = reviews[index];
                    return ReviewItem(key: ValueKey(review.id), review: review);
                  }, childCount: reviews.length),
                ),
                const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
              ],
            ),
          );
        },
      ),
    );
  }

  void _refreshReviews(BuildContext context) {
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>;
    final productId = extra['productId'] as String;
    context.read<GetProductReviewsCubit>().getProductReviews(productId);
  }
}
