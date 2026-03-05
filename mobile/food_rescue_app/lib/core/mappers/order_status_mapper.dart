import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../Features/orders/data/models/order_status_config.dart';
import '../enums/order_status.dart';

class OrderStatusMapper {
  static OrderStatusConfig getOrderStatusConfig(OrderStatus orderStatus) {
    switch (orderStatus) {
      case OrderStatus.ready:
        return const OrderStatusConfig(
          color: Color(0xFF2ECC71),
          text: "Ready for Pickup",
          icon: LucideIcons.packageCheck,
        );
      case OrderStatus.preparing:
        return const OrderStatusConfig(
          color: Color(0xFFFFA940),
          text: "Being Prepared",
          icon: LucideIcons.chefHat,
        );
      case OrderStatus.completed:
        return const OrderStatusConfig(
          color: Colors.grey,
          text: "Completed",
          icon: LucideIcons.checkCircle,
        );
      case OrderStatus.cancelled:
        return const OrderStatusConfig(
          color: Color(0xFFE74C3C),
          text: "Cancelled",
          icon: LucideIcons.clock,
        );
      case OrderStatus.pending:
        return const OrderStatusConfig(
          color: Color(0xFF6C757D),
          text: "Pending",
          icon: LucideIcons.clock,
        );
    }
  }
}
