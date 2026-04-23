import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import 'package:waste2taste/Features/products/domain/use_cases/get_product_reviews_usecase.dart';
import 'package:waste2taste/Features/products/presentation/manager/add_review_cubit/add_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/delete_review_cubit/delete_review_cubit.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/custom_floating_action_button.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/product_review_view_body.dart';
import 'package:waste2taste/Features/products/presentation/views/widgets/reviews_app_bar.dart';

class ProductReviewsView extends StatelessWidget {
  const ProductReviewsView({super.key});

  @override
  Widget build(BuildContext context) {
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>;
    final productId = extra['productId'] as String;
    final existingCubit = extra['getReviewsCubit'] as GetProductReviewsCubit?;

    return MultiBlocProvider(
      providers: [
        if (existingCubit != null)
          BlocProvider.value(value: existingCubit)
        else
          BlocProvider(
            create: (context) => GetProductReviewsCubit(
              getIt.get<GetProductReviewsUsecase>(),
            )..getProductReviews(productId),
          ),
        BlocProvider(create: (context) => getIt.get<AddReviewCubit>()),
        BlocProvider(create: (context) => getIt.get<DeleteReviewCubit>()),
      ],
      child: Scaffold(
        appBar: const ReviewsAppBar(),
        body: const ProductReviewsViewBody(),
        floatingActionButton: const CustomFloatingActionButtom(),
      ),
    );
  }
}
