import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '/core/utils/app_routes.dart';
import '../../../data/models/product_model.dart';
import '../../../../../core/widgets/custom_sliver_app_bar.dart';
import 'customer_card.dart';
import 'products_sliver_list_builder.dart';
import '../../../../../core/widgets/section_header.dart';

class HomeViewBody extends StatelessWidget {
  const HomeViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        CustomSliverAppBar(
          toolbarHeight: 90,
          widget: CustomerCard(
            userName: 'userName',
            location: 'location',
            profileImageUrl: 'profileImageUrl',
          ),
        ),
        SliverToBoxAdapter(
          child: SectionHeader(
            title: context.loc.nearbyDeals,
            onTap: () => GoRouter.of(context).push(AppRoutes.allProducts),
          ),
        ),
        ProductsSliverListBuilder(products: mockProducts),
      ],
    );
  }
}
