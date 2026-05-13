import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_by_id_cubit/get_product_by_id_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_by_id_cubit/get_product_by_id_state.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_state.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/reviews_section.dart';
import '../../../../../core/functions/setup_service_locator.dart';

class ReviewsSectionBlocBuilder extends StatelessWidget {
  const ReviewsSectionBlocBuilder({super.key, required this.product});

  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt.get<GetProductByIdCubit>(),
      child: BlocListener<GetProductReviewsCubit, GetProductReviewsState>(
        listener: (context, state) {
          if (state is GetProductReviewsSuccess) {
            context.read<GetProductByIdCubit>().getProductById(product.id);
          }
        },
        child: BlocBuilder<GetProductByIdCubit, GetProductByIdState>(
          builder: (context, state) {
            double rating = product.rating;
            int totalReviews = product.totalReviews;

            if (state is GetProductByIdSuccess) {
              rating = state.product.rating;
              totalReviews = state.product.totalReviews;
            }

            return ReviewsSection(
              rating: rating,
              totalReviews: totalReviews,
              vendorId: product.vendorId,
              productId: product.id,
            );
          },
        ),
      ),
    );
  }
}
