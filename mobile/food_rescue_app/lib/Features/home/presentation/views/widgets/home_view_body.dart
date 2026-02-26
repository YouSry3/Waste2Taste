import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '/core/utils/app_routes.dart';
import '../../../../../core/constants/app_strings.dart';
import '../../../data/models/product_model.dart';
import 'custom_sliver_app_bar.dart';
import 'customer_card.dart';
import 'products_sliver_list_builder.dart';
import 'section_header.dart';

class HomeViewBody extends StatelessWidget {
  const HomeViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    final products = mockProducts.map((e) => ProductModel.fromJson(e)).toList();
    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        CustomSliverAppBar(
          widget: CustomerCard(
            userName: 'userName',
            location: 'location',
            profileImageUrl: 'profileImageUrl',
          ),
        ),
        SliverToBoxAdapter(
          child: SectionHeader(
            title: AppStrings.nearbyDeals,
            onTap: () => GoRouter.of(context).push(AppRoutes.productDetails),
          ),
        ),
        ProductsSliverListBuilder(products: products),
        const SliverPadding(padding: EdgeInsets.only(bottom: 20)),
      ],
    );
  }
}
