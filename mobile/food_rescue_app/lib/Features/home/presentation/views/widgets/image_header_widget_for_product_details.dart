import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../data/models/product_model.dart';
import 'circle_icon_button.dart';
import 'product_image_header.dart';

class ImageHeaderWidgetForProductDetails extends StatelessWidget {
  const ImageHeaderWidgetForProductDetails({super.key, required this.product});

  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ProductImageHeader(
          model: product,
          farFromBottom: 30,
          stackFit: StackFit.expand,
        ),
        Positioned(
          top: 42,
          left: 16,
          right: 16,
          child: Row(
            children: [
              CircleIconButton(
                icon: LucideIcons.arrowLeft,
                onPressed: () => GoRouter.of(context).pop(),
              ),
              const Spacer(),
              CircleIconButton(
                icon: LucideIcons.heart,
                color: AppColors.accent,
                onPressed: () {},
              ),
              const SizedBox(width: 12),
              CircleIconButton(icon: LucideIcons.share2, onPressed: () {}),
            ],
          ),
        ),
      ],
    );
  }
}
