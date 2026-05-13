import 'package:flutter/material.dart';
import 'package:waste2taste/Features/orders/data/models/order_model.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/functions/format_pickup_time.dart';
import 'direction_button.dart';

class ActiveOrderFooter extends StatelessWidget {
  final OrderModel order;

  const ActiveOrderFooter({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  context.loc.pickupDetails,
                  style: AppTextStyles.body(context).copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textGray,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  formatPickupTime(order.pickupTime),
                  style: AppTextStyles.body(context).copyWith(fontSize: 15),
                ),
              ],
            ),
          ),
          DirectionsButton(
            vendorLat: order.vendorLatitude,
            vendorLng: order.vendorLongitude,
          ),
        ],
      ),
    );
  }
}
