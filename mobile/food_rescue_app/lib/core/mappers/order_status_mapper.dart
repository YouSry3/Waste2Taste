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
      case OrderStatus.pending:
        return OrderStatusConfig(
          color: const Color(0xFFFFA940),
          text: context.loc.statusPending,
          icon: LucideIcons.clock,
        );

      case OrderStatus.readyForPickup:
        return OrderStatusConfig(
          color: const Color(0xFF2ECC71),
          text: context.loc.statusReady,
          icon: LucideIcons.packageCheck,
        );

      case OrderStatus.completed:
        return OrderStatusConfig(
          color: Colors.grey,
          text: context.loc.statusCompleted,
          icon: LucideIcons.checkCircle,
        );
    }
  }
}
