import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/customer_card_bloc_builder.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../domain/entities/product_entity.dart';
import '../../manager/get_products_cubit/get_products_cubit.dart';
import '../../manager/get_products_cubit/get_products_state.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../../../../core/widgets/section_header.dart';
import '/core/utils/app_routes.dart';
import 'products_sliver_list_builder.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';
import 'package:waste2taste/core/functions/calculate_distance.dart';
import 'package:waste2taste/core/constants/keys.dart';
import 'package:waste2taste/core/database/pref_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';

class HomeViewBody extends StatelessWidget {
  const HomeViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async =>
          await context.read<GetProductsCubit>().getProducts(),
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        slivers: [
          CustomSliverAppBar(
            toolbarHeight: 90,
            widget: const CustomerCardBlocBuilder(),
          ),
          SliverToBoxAdapter(
            child: SectionHeader(
              title: context.loc.nearbyDeals,
              onTap: () async {
                final result = await GoRouter.of(
                  context,
                ).push(AppRoutes.allProducts);
                if (result == true && context.mounted) {
                  context.read<GetProductsCubit>().getProducts();
                }
              },
            ),
          ),
          BlocBuilder<GetUserLocationCubit, GetUserLocationState>(
            builder: (context, locationState) {
              return BlocBuilder<GetProductsCubit, GetProductsState>(
                builder: (context, state) {
                  List<ProductEntity> products =
                      state is GetProductsSuccessState
                      ? state.data
                      : skeletonProducts;

                  final isProductsLoading =
                      state is GetProductsInitialState ||
                      state is GetProductsLoadingState;

                  if (!isProductsLoading &&
                      locationState is GetUserLocationSuccessState) {
                    final maxDistance = getIt.get<PrefsService>().getDouble(kDistanceOffersKey) ?? 30.0;
                    if (maxDistance < 100.0) {
                      products = products.where((product) {
                        final distance = calculateDistance(
                          locationState.locationEntity.latitude,
                          locationState.locationEntity.longitude,
                          product.latitude,
                          product.longitude,
                        );
                        return distance <= maxDistance;
                      }).toList();
                    }
                  }

                  if (!isProductsLoading && products.isEmpty) {
                    return SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: Center(
                          child: Text(
                            context.loc.noOffersNearby,
                            style: AppTextStyles.body(
                              context,
                            ).copyWith(color: AppColors.textGray),
                          ),
                        ),
                      ),
                    );
                  }

                  return Skeletonizer.sliver(
                    enabled: isProductsLoading,
                    child: ProductsSliverListBuilder(
                      products: products,
                      onChanged: () {},
                    ),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
