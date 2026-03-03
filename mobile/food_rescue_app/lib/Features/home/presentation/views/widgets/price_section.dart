import 'package:flutter/material.dart';
import '../../../data/models/product_model.dart';
import 'custom_card_widget.dart';
import 'details_price_row.dart';
import 'saving_bannner.dart';

class PriceSection extends StatelessWidget {
  const PriceSection({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    final savings = product.originalPrice - product.price;

    return CustomCardWidget(
      widget: Column(
        children: [
          DetailsPriceRow(product: product),
          const SizedBox(height: 16),
          SavingsBanner(amount: savings),
        ],
      ),
    );
  }
}
