import 'package:flutter/material.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../data/models/product_model.dart';
import 'price_column.dart';

class DetailsPriceRow extends StatelessWidget {
  const DetailsPriceRow({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        PriceColumn(
          label: context.loc.originalPrice,
          price: product.originalPrice,
          isOldPrice: true,
        ),
        PriceColumn(label: context.loc.yourPrice, price: product.price),
      ],
    );
  }
}
