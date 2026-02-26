import 'package:flutter/material.dart';
import '../../../data/models/product_model.dart';
import 'price_row.dart';
import 'product_title_row.dart';
import 'vendor_meta_row.dart';

class ProductItemDetails extends StatelessWidget {
  const ProductItemDetails({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProductTitleRow(title: product.title, rating: product.vendorRating),
          const SizedBox(height: 8),
          VendorMetaRow(
            vendorName: product.vendorName,
            distance: product.distance,
          ),
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
