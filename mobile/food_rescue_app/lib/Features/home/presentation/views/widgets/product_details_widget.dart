import 'package:flutter/material.dart';

import '../../../data/models/product_model.dart';
import 'description_section.dart';
import 'location_section.dart';
import 'price_section.dart';
import 'product_info_section.dart';
import 'reviews_section.dart';

class ProductDetailsWidget extends StatelessWidget {
  const ProductDetailsWidget({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProductInfoSection(product: product),
          const SizedBox(height: 16),
          ReviewsSection(rating: product.vendorRating),
          const SizedBox(height: 24),
          DescriptionSection(description: product.description),
          const SizedBox(height: 24),
          PriceSection(product: product),
          const SizedBox(height: 24),
          LocationSection(product: product),
        ],
      ),
    );
  }
}
