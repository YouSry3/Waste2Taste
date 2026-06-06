import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'vendor_card.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class ProductInfoSection extends StatelessWidget {
  const ProductInfoSection({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    final hasQuantity = product.quantity > 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                product.name,
                style: AppTextStyles.title(context),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: hasQuantity
                    ? Theme.of(context).colorScheme.secondary.withValues(alpha: 0.12)
                    : Colors.red.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                hasQuantity
                    ? context.loc.quantityLeft(product.quantity)
                    : context.loc.soldOut,
                style: AppTextStyles.label(context).copyWith(
                  color: hasQuantity
                      ? Theme.of(context).colorScheme.secondary
                      : Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        VendorCard(
          vendorName: product.vendorName,
          vendorId: product.vendorId,
          latitude: product.latitude,
          longitude: product.longitude,
        ),
      ],
    );
  }
}
