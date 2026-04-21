import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../data/models/product_model.dart';
import 'vendor_card.dart';

class ProductInfoSection extends StatelessWidget {
  const ProductInfoSection({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(product.name, style: AppTextStyles.title(context)),
        const SizedBox(height: 8),
        VendorCard(vendorName: product.vendorName),
      ],
    );
  }
}
