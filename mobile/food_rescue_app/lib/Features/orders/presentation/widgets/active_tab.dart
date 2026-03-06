import 'package:flutter/material.dart';
import '../../data/models/order_model.dart';
import 'order_card.dart';

class ActiveTab extends StatelessWidget {
  const ActiveTab({super.key});

  @override
  Widget build(BuildContext context) {
    if (mockActiveOrders.isEmpty) {
      return const Center(child: Text("No Active Orders"));
    }

    return ListView.separated(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: mockActiveOrders.length,
      separatorBuilder: (_, _) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return OrderCard(order: mockActiveOrders[index], isActive: true, index: index);
      },
    );
  }
}
