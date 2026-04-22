import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../domain/entities/product_entity.dart';
import '../../../../../core/utils/app_routes.dart';
import 'custom_product_item.dart';

class ProductsSliverListBuilder extends StatelessWidget {
  const ProductsSliverListBuilder({super.key, required this.products});
  final List<ProductEntity> products;
  @override
  Widget build(BuildContext context) {
    return SliverList.builder(
      itemCount: products.length,
      itemBuilder: (BuildContext context, int index) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
          child: GestureDetector(
            onTap: () => GoRouter.of(
              context,
            ).push(AppRoutes.productDetails, extra: products[index]),
            child: CustomProductItem(product: products[index]),
          ),
        );
      },
    );
  }
}
