import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/data/models/product_model.dart';
import 'discount_page.dart';
import 'expiry_badge.dart';
import 'rounded_top_image.dart';

class ProductImageHeader extends StatelessWidget {
  final ProductModel model;
  final double? farFromTop;
  final double? farFromBottom;
  final StackFit? stackFit;
  const ProductImageHeader({
    super.key,
    required this.model,
    this.farFromTop,
    this.stackFit,
    this.farFromBottom,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: stackFit ?? StackFit.loose,
      children: [
        RoundedTopImage(imageUrl: model.imageUrl),
        Positioned(
          top: farFromTop,
          left: 16,
          bottom: farFromBottom,
          child: ExpiryBadge(expiryTime: model.expiryTime),
        ),
        Positioned(
          top: farFromTop,
          right: 16,
          bottom: farFromBottom,
          child: DiscountBadge(discountPercentage: model.discountPercentage),
        ),
      ],
    );
  }
}
