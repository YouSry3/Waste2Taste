import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../data/models/order_model.dart';

class OrderInfo extends StatelessWidget {
  const OrderInfo({super.key, required this.order});
  final OrderModel order;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          order.itemTitle,
          style: AppTextStyles.body.copyWith(fontSize: 18),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            const Icon(LucideIcons.store, size: 14, color: Colors.grey),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                order.vendorName,
                style: AppTextStyles.body.copyWith(
                  fontSize: 13,
                  color: AppColors.textGray,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          "\$${order.price.toStringAsFixed(2)}",
          style: AppTextStyles.body.copyWith(
            fontSize: 18,
            color: AppColors.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
