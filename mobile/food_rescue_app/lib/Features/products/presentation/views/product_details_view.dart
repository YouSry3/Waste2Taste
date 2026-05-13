import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/products/domain/use_cases/get_product_reviews_usecase.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_product_reviews_cubit/get_product_reviews_cubit.dart';
import 'package:waste2taste/Features/products/presentation/manager/toggle_favorite_cubit/toggle_favorite_cubit.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'widgets/product_details_view_body.dart';
import 'package:go_router/go_router.dart';

import 'package:waste2taste/Features/orders/presentation/manager/reserve_order_cubit/reserve_order_cubit.dart';

class ProductDetailsView extends StatelessWidget {
  const ProductDetailsView({super.key});

  @override
  Widget build(BuildContext context) {
    final product = GoRouterState.of(context).extra as ProductEntity;
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => GetProductReviewsCubit(
            getIt.get<GetProductReviewsUsecase>(),
          )..getProductReviews(product.vendorId),
        ),
        BlocProvider(
          create: (context) => getIt.get<ReserveOrderCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt.get<ToggleFavoriteCubit>(),
        ),
        BlocProvider.value(
          value: getIt.get<GetProductsCubit>(),
        ),
      ],
      child: const Scaffold(
        body: ProductDetailsViewBody(),
      ),
    );
  }
}







