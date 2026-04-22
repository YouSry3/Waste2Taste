import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'custom_card_shell.dart';
import 'product_image_header.dart';
import 'product_item_details.dart';

class CustomProductItem extends StatelessWidget {
  const CustomProductItem({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: CustomCardShell(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ProductImageHeader(model: product, farFromTop: 16),
            ProductItemDetails(product: product),
          ],
        ),
      ),
    );
  }
}
