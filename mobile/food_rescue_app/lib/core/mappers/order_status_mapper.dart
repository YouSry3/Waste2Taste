import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../Features/orders/data/models/order_status_config.dart';
import '../enums/order_status.dart';
import '../extensions/app_localization_extention.dart';

class OrderStatusMapper {
  static OrderStatusConfig getOrderStatusConfig(
    BuildContext context,
    OrderStatus orderStatus,
  ) {
    switch (orderStatus) {
      case OrderStatus.ready:
        return OrderStatusConfig(
          color: const Color(0xFF2ECC71),
          text: context.loc.statusReady,
          icon: LucideIcons.packageCheck,
        );

      case OrderStatus.preparing:
        return OrderStatusConfig(
          color: const Color(0xFFFFA940),
          text: context.loc.statusPreparing,
          icon: LucideIcons.chefHat,
        );

      case OrderStatus.completed:
        return OrderStatusConfig(
          color: Colors.grey,
          text: context.loc.statusCompleted,
          icon: LucideIcons.checkCircle,
        );

      case OrderStatus.cancelled:
        return OrderStatusConfig(
          color: const Color(0xFFE74C3C),
          text: context.loc.statusCancelled,
          icon: LucideIcons.clock,
        );

      case OrderStatus.pending:
        return OrderStatusConfig(
          color: const Color(0xFF6C757D),
          text: context.loc.statusPending,
          icon: LucideIcons.clock,
        );
    }
  }
}
