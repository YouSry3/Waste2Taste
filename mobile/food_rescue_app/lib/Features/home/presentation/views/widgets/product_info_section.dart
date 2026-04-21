import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../data/models/product_model.dart';
import 'vendor_card.dart';

class ProductInfoSection extends StatelessWidget {
  const ProductInfoSection({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(product.title, style: AppTextStyles.title(context)),
        const SizedBox(height: 8),
        VendorCard(vendorName: product.vendorName),
      ],
    );
  }
}
