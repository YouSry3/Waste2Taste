import 'package:flutter/material.dart';

import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'state_item.dart';

class StatesRow extends StatelessWidget {
  const StatesRow({
    super.key,
    required this.orderCount,
    required this.moneySpent,
    required this.moneySaved,
  });

  final int orderCount;
  final double moneySpent;
  final double moneySaved;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: .3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          StateItem(value: orderCount.toString(), label: context.loc.orders),
          const VerticalDivider(),
          StateItem(value: '\$${moneySpent.toStringAsFixed(0)}', label: context.loc.moneySpent),
          const VerticalDivider(),
          StateItem(value: '\$${moneySaved.toStringAsFixed(0)}', label: context.loc.moneySaved),
        ],
      ),
    );
  }
}
