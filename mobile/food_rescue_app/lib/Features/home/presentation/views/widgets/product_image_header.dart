import 'package:flutter/material.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import 'discount_page.dart';
import 'expiry_badge.dart';
import 'rounded_top_image.dart';

class ProductImageHeader extends StatelessWidget {
  final ProductEntity model;
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
        RoundedTopImage(
          imageUrl: model.imageUrl,
          heroTag: 'product-image-${model.id}',
        ),
        Positioned(
          top: farFromTop,
          left: 16,
          bottom: farFromBottom,
          child: ExpiryBadge(expiryTime: model.expiresIn),
        ),
        Positioned(
          top: farFromTop,
          right: 16,
          bottom: farFromBottom,
          child: DiscountBadge(
            discountPercentage: model.discountPercentage.toString(),
          ),
        ),
      ],
    );
  }
}
