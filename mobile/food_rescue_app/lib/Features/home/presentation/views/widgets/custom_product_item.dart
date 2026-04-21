import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
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
        )
        .animate()
        .fadeIn(duration: 400.ms, delay: (100).ms)
        .slideY(begin: 0.1, end: 0, curve: Curves.easeOutQuad);
  }
}
