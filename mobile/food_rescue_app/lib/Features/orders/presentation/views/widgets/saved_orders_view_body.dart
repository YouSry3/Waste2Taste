import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/products_sliver_list_builder.dart';
import 'package:waste2taste/Features/products/presentation/manager/get_favorite_products_cubit/get_favorite_products_cubit.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';

class SavedOrdersViewBody extends StatelessWidget {
  const SavedOrdersViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        CustomSliverAppBar(
          widget: Text(
            context.loc.savedOffers,
            style: AppTextStyles.title(context),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 10)),
        BlocBuilder<GetFavoriteProductsCubit, GetFavoriteProductsState>(
          builder: (context, state) {
            if (state is GetFavoriteProductsLoading) {
              return Skeletonizer.sliver(
                enabled: true,
                child: ProductsSliverListBuilder(products: skeletonProducts),
              );
            } else if (state is GetFavoriteProductsSuccess) {
              if (state.products.isEmpty) {
                return SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(
                    child: Text(
                      context.loc.noSavedOffers,
                      style: AppTextStyles.body(context),
                    ),
                  ),
                );
              }
              return ProductsSliverListBuilder(
                products: state.products,
                onChanged: () {
                  context
                      .read<GetFavoriteProductsCubit>()
                      .getFavoriteProducts();
                },
              );
            } else if (state is GetFavoriteProductsFailure) {
              return SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        state.errMessage,
                        style: AppTextStyles.body(context),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          context
                              .read<GetFavoriteProductsCubit>()
                              .getFavoriteProducts();
                        },
                        child: Text(context.loc.retry),
                      ),
                    ],
                  ),
                ),
              );
            }
            return const SliverToBoxAdapter(child: SizedBox.shrink());
          },
        ),
      ],
    );
  }
}
