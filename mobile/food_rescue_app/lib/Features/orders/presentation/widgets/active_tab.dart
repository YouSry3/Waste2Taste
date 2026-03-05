import 'package:flutter/material.dart';
import '../../data/models/order_model.dart';
import 'order_card.dart';

class ActiveTab extends StatelessWidget {
  final List<OrderModel> orders;

  const ActiveTab({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return const Center(child: Text("No Active Orders"));
    }

    return ListView.separated(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      separatorBuilder: (_, _) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return OrderCard(order: orders[index], isActive: true, index: index);
      },
    );
  }
}
