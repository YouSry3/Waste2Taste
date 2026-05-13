import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/functions/format_pickup_time.dart';
import '../../../data/models/order_model.dart';

class PastOrderFooter extends StatelessWidget {
  final OrderModel order;

  const PastOrderFooter({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(
        context.loc.completedOn(formatPickupTime(order.pickupTime)),
        style: AppTextStyles.body(context).copyWith(
          color: AppColors.textGray,
          fontSize: 14,
        ),
      ),
    );
  }
}
