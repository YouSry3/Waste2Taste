import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_state.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import '../../manager/all_products_filter_cubit/all_products_filter_cubit.dart';
import 'custom_search_widget.dart';
import 'package:waste2taste/core/widgets/custom_sliver_app_bar.dart';
import 'products_sliver_list_builder.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_user_location_cubit/get_user_location_cubit.dart';
import 'package:waste2taste/core/functions/calculate_distance.dart';
import 'filter_bottom_sheet.dart';

class AllProductsViewBody extends StatelessWidget {
  const AllProductsViewBody({super.key});

  List<ProductEntity> _getFilteredProducts({
    required List<ProductEntity> products,
    required GetUserLocationState locationState,
    required String searchQuery,
    required double maxPrice,
    required double maxDistance,
  }) {
    return products.where((product) {
      final matchesSearch =
          product.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
          product.vendorName.toLowerCase().contains(searchQuery.toLowerCase());
      final matchesPrice = product.price <= maxPrice;

      bool matchesDistance = true;
      if (locationState is GetUserLocationSuccessState) {
        final distance = calculateDistance(
          locationState.locationEntity.latitude,
          locationState.locationEntity.longitude,
          product.latitude,
          product.longitude,
        );
        matchesDistance = distance <= maxDistance;
      }

      return matchesSearch && matchesPrice && matchesDistance;
    }).toList();
  }

  void _openFilter(BuildContext context) async {
    final cubit = context.read<AllProductsFilterCubit>();
    final result = await showModalBottomSheet<Map<String, double>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FilterBottomSheet(
        initialMaxPrice: cubit.state.maxPrice,
        initialMaxDistance: cubit.state.maxDistance,
      ),
    );

    if (result != null) {
      cubit.updateFilters(
        result['maxPrice']!,
        result['maxDistance']!,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AllProductsFilterCubit, AllProductsFilterState>(
      builder: (context, filterState) {
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) {
            if (didPop) return;
            context.pop(filterState.anyDataChanged);
          },
          child: BlocBuilder<GetUserLocationCubit, GetUserLocationState>(
            builder: (context, locationState) {
              return BlocBuilder<GetProductsCubit, GetProductsState>(
                builder: (context, state) {
                  final bool isProductsLoading =
                      state is GetProductsInitialState ||
                      state is GetProductsLoadingState;

                  final List<ProductEntity> allProducts =
                      state is GetProductsSuccessState ? state.data : [];

                  final filteredProducts = _getFilteredProducts(
                    products: allProducts,
                    locationState: locationState,
                    searchQuery: filterState.searchQuery,
                    maxPrice: filterState.maxPrice,
                    maxDistance: filterState.maxDistance,
                  );

                  return CustomScrollView(
                    slivers: [
                      CustomSliverAppBar(
                        onBackPressed: () =>
                            context.pop(filterState.anyDataChanged),
                        widget: Text(
                          context.loc.allProducts,
                          style: AppTextStyles.title(context),
                        ),
                      ),
                      HomeSearchBar(
                        onSearchChanged: (query) {
                          context
                              .read<AllProductsFilterCubit>()
                              .updateSearchQuery(query);
                        },
                        onFilterPressed: () => _openFilter(context),
                      ),
                      if (!isProductsLoading && filteredProducts.isEmpty)
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 60),
                            child: Center(
                              child: Text(
                                context.loc.noOffersNearby,
                                style: AppTextStyles.body(context).copyWith(
                                  color: AppColors.textGray,
                                ),
                              ),
                            ),
                          ),
                        )
                      else
                        Skeletonizer.sliver(
                          enabled: isProductsLoading,
                          child: ProductsSliverListBuilder(
                            products: filteredProducts,
                            onChanged: () {
                              context
                                  .read<AllProductsFilterCubit>()
                                  .setDataChanged(true);
                            },
                          ),
                        ),
                    ],
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
