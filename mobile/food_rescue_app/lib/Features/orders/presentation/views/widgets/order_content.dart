import 'package:flutter/material.dart';
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
        ],
      ),
    );
  }
}
