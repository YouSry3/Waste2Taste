import 'package:flutter/material.dart';
import 'add_to_cart_button.dart';
import 'price_display.dart';

class PricingRow extends StatelessWidget {
  const PricingRow({
    super.key,
    required this.price,
    required this.originalPrice,
  });
  final double price;
  final double originalPrice;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        PriceDisplay(price: price, originalPrice: originalPrice),
        const AddToCartButton(),
      ],
    );
  }
}
