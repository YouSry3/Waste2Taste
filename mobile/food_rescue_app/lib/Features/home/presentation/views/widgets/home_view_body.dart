import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/customer_card_bloc_selector.dart';
import '../../../domain/entities/product_entity.dart';
import '../../manager/get_products_cubit/get_products_cubit.dart';
import '../../manager/get_products_cubit/get_products_state.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/widgets/section_header.dart';
import '/core/utils/app_routes.dart';
import 'products_sliver_list_builder.dart';

class HomeViewBody extends StatelessWidget {
  const HomeViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        CustomSliverAppBar(
          toolbarHeight: 90,
          widget: const CustomerCardBlocSelector(),
        ),
        SliverToBoxAdapter(
          child: SectionHeader(
            title: context.loc.nearbyDeals,
            onTap: () => GoRouter.of(context).push(AppRoutes.allProducts),
          ),
        ),
        BlocBuilder<GetProductsCubit, GetProductsState>(
          builder: (context, state) {
            final List<ProductEntity> products =
                state is GetProductsSuccessState
                ? state.data
                : skeletonProducts;
            final isProductsLoading =
                state is GetProductsInitialState ||
                state is GetProductsLoadingState;

            return Skeletonizer.sliver(
              enabled: isProductsLoading,
              child: ProductsSliverListBuilder(products: products),
            );
          },
        ),
      ],
    );
  }
}
