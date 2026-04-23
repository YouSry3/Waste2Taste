import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_state.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/reviews_section.dart';

class ReviewsSectionBlocBuilder extends StatelessWidget {
  const ReviewsSectionBlocBuilder({super.key, required this.product});

  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<GetProductReviewsCubit, GetProductReviewsState>(
      builder: (context, state) {
        double? updatedRating;
        int? updatedTotalReviews;

        if (state is GetProductReviewsSuccess) {
          updatedTotalReviews = state.reviews.length;
          updatedRating = updatedTotalReviews == 0
              ? 0.0
              : state.reviews.fold(0.0, (sum, item) => sum + item.rating) /
                    updatedTotalReviews;
        }

        return ReviewsSection(
          rating: updatedRating ?? product.rating,
          totalReviews: updatedTotalReviews ?? product.totalReviews,
          productId: product.id,
        );
      },
    );
  }
}
