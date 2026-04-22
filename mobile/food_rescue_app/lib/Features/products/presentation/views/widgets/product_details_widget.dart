import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'description_section.dart';
import 'location_section.dart';
import '../../../../home/presentation/views/widgets/price_section.dart';
import '../../../../home/presentation/views/widgets/product_info_section.dart';
import 'reviews_section.dart';

class ProductDetailsWidget extends StatelessWidget {
  const ProductDetailsWidget({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProductInfoSection(product: product),
          const SizedBox(height: 16),
          ReviewsSection(rating: product.rating),
          const SizedBox(height: 24),
          DescriptionSection(description: product.name),
          const SizedBox(height: 24),
          PriceSection(product: product),
          const SizedBox(height: 24),
          LocationSection(product: product),
        ],
      ),
    );
  }
}
