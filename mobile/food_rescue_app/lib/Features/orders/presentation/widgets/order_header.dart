import 'package:flutter/material.dart';

import '../../data/models/order_status_config.dart';
import 'status_badge.dart';

class OrderHeader extends StatelessWidget {
  const OrderHeader({
    super.key,
    required this.orderId,
    required this.statusConfig,
  });
  final String orderId;
  final OrderStatusConfig statusConfig;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          StatusBadge(config: statusConfig),
          Text(
            "#$orderId",
            style: TextStyle(
              color: Colors.grey[400],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
