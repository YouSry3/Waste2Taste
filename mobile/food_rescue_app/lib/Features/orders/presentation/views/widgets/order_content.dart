import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/utils/app_routes.dart';
import '../../../data/models/order_model.dart';
import 'order_image.dart';
import 'order_info.dart';

class OrderContent extends StatelessWidget {
  final OrderModel order;

  const OrderContent({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          OrderImage(imageUrl: order.imageUrl),
          const SizedBox(width: 16),
          Expanded(child: OrderInfo(order: order)),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'report') {
                GoRouter.of(context).push(
                  AppRoutes.reportVendorView,
                  extra: order.orderId,
                );
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'report',
                child: Text(context.loc.reportThisVendor),
              ),
            ],
            icon: const Icon(Icons.more_vert_outlined),
          ),
        ],
      ),
    );
  }
}
