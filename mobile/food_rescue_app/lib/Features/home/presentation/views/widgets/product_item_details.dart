import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'price_row.dart';
import 'product_title_row.dart';
import 'vendor_meta_row_bloc_selector.dart';

class ProductItemDetails extends StatelessWidget {
  const ProductItemDetails({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProductTitleRow(title: product.name, rating: product.rating),
          const SizedBox(height: 8),
          VendorMetaRowBlocSelector(product: product),
          const SizedBox(height: 16),
          PricingRow(
            price: product.price,
            originalPrice: product.originalPrice,
          ),
        ],
      ),
    );
  }
}
