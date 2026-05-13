import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_cubit.dart';
import 'package:waste2taste/Features/home/presentation/manager/get_products_cubit/get_products_state.dart';
import 'package:waste2taste/Features/home/presentation/views/widgets/custom_product_item.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import 'package:waste2taste/core/extensions/app_localization_extention.dart';
import 'package:waste2taste/core/utils/app_routes.dart';

import '../../../../core/functions/setup_service_locator.dart';

class VendorProductsView extends StatelessWidget {
  const VendorProductsView({super.key});

  @override
  Widget build(BuildContext context) {
    final extra = GoRouterState.of(context).extra;
    final args = extra is Map ? extra : {};
    final String vendorId = args['vendorId']?.toString() ?? '';
    final String vendorName = args['vendorName']?.toString() ?? '';

    return Scaffold(
      body: BlocProvider.value(
        value: getIt<GetProductsCubit>(),
        child: BlocBuilder<GetProductsCubit, GetProductsState>(
          builder: (context, state) {
            if (state is GetProductsLoadingState) {
              return const Center(child: CircularProgressIndicator());
            }
            final List<ProductEntity> allProducts =
                state is GetProductsSuccessState ? state.data : [];
            final vendorProducts =
                allProducts.where((p) => p.vendorId == vendorId).toList();

            return CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                SliverAppBar(
                  expandedHeight: 140,
                  pinned: true,
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  surfaceTintColor: Colors.transparent,
                  leading: IconButton(
                    icon: const Icon(LucideIcons.arrowLeft),
                    onPressed: () => GoRouter.of(context).pop(),
                  ),
                  flexibleSpace: FlexibleSpaceBar(
                    titlePadding: const EdgeInsets.only(left: 56, bottom: 16),
                    title: Text(
                      vendorName,
                      style: AppTextStyles.label(
                        context,
                      ).copyWith(fontSize: 16),
                    ),
                    background: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            AppColors.primary.withValues(alpha: 0.15),
                            AppColors.primary.withValues(alpha: 0.05),
                          ],
                        ),
                      ),
                      child: Center(
                        child: CircleAvatar(
                          radius: 32,
                          backgroundColor: AppColors.primary.withValues(
                            alpha: 0.15,
                          ),
                          child: Text(
                            vendorName.isNotEmpty
                                ? vendorName[0].toUpperCase()
                                : "?",
                            style: AppTextStyles.title(
                              context,
                            ).copyWith(color: AppColors.primary, fontSize: 28),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                  sliver: SliverToBoxAdapter(
                    child: Row(
                      children: [
                        Icon(
                          LucideIcons.shoppingBag,
                          size: 18,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${vendorProducts.length} ${context.loc.allProducts}',
                          style: AppTextStyles.label(context),
                        ),
                      ],
                    ),
                  ),
                ),
                if (vendorProducts.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            LucideIcons.packageX,
                            size: 64,
                            color: AppColors.textMuted(context),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            context.loc.noOffersNearby,
                            style: AppTextStyles.body(
                              context,
                            ).copyWith(color: AppColors.textMuted(context)),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  SliverList.builder(
                    itemCount: vendorProducts.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
                        child: GestureDetector(
                          onTap: () {
                            GoRouter.of(context).push(
                              AppRoutes.productDetails,
                              extra: vendorProducts[index],
                            );
                          },
                          child: CustomProductItem(
                            product: vendorProducts[index],
                          ),
                        ),
                      );
                    },
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}
