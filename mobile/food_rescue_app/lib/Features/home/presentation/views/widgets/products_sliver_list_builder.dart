import 'package:flutter/material.dart';
import '../../../data/models/product_model.dart';
import 'custom_product_item.dart';

class ProductsSliverListBuilder extends StatelessWidget {
  const ProductsSliverListBuilder({super.key, required this.products});
  final List<ProductModel> products;
  @override
  Widget build(BuildContext context) {
    return SliverList.builder(
      itemCount: products.length,
      itemBuilder: (BuildContext context, int index) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
          child: CustomProductItem(product: products[index]),
        );
      },
    );
  }
}
