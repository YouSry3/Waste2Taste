import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/mappers/order_status_mapper.dart';
import '../../../data/models/order_model.dart';
import 'active_order_footer.dart';
import 'order_content.dart';
import 'order_header.dart';
import 'past_order_footer.dart';

class OrderCard extends StatelessWidget {
  final OrderModel order;
  final bool isActive;
  final int index;

  const OrderCard({
    super.key,
    required this.order,
    required this.isActive,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final statusConfig = OrderStatusMapper.getOrderStatusConfig(
      context,
      order.status,
    );
    return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(24),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0A000000),
                blurRadius: 16,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(24),
            onTap: () {},
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                OrderHeader(orderId: order.id, statusConfig: statusConfig),
                OrderContent(order: order),
                isActive
                    ? ActiveOrderFooter(pickupTime: order.pickupTime)
                    : PastOrderFooter(order: order),
              ],
            ),
          ),
        )
        .animate(autoPlay: true)
        .fadeIn(duration: 400.ms, delay: (index * 80).ms, curve: Curves.easeOut)
        .slideY(
          begin: 0.2,
          end: 0,
          duration: 400.ms,
          curve: Curves.easeOutCubic,
        )
        .scale(
          begin: const Offset(0.98, 0.98),
          end: const Offset(1, 1),
          duration: 300.ms,
        );
  }
}
