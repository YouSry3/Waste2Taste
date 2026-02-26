import 'package:flutter/material.dart';
import 'discount_page.dart';
import 'expiry_badge.dart';
import 'rounded_top_image.dart';

class ProductImageHeader extends StatelessWidget {
  final String imageUrl;
  final String expiryTime;
  final String discountPercentage;

  const ProductImageHeader({
    super.key,
    required this.imageUrl,
    required this.expiryTime,
    required this.discountPercentage,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        RoundedTopImage(imageUrl: imageUrl),
        Positioned(
          top: 16,
          left: 16,
          child: ExpiryBadge(expiryTime: expiryTime),
        ),
        Positioned(
          top: 16,
          right: 16,
          child: DiscountBadge(discountPercentage: discountPercentage),
        ),
      ],
    );
  }
}
