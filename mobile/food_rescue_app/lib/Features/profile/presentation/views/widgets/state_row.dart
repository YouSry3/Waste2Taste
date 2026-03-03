import 'package:flutter/material.dart';

import '../../../../../core/constants/app_colors.dart';
import 'state_item.dart';

class StatesRow extends StatelessWidget {
  const StatesRow({super.key});

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
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          StateItem(value: '24', label: 'Orders'),
          VerticalDivider(),
          StateItem(value: '\$180', label: 'Money Spent'),
          VerticalDivider(),
          StateItem(value: '\$80', label: 'Money Saved'),
        ],
      ),
    );
  }
}
