import 'package:flutter/material.dart';
import '../../data/models/order_model.dart';
import 'order_card.dart';

class HistoryTab extends StatelessWidget {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    if (mockHistoryOrders.isEmpty) {
      return const Center(child: Text("No History Orders"));
    }

    return ListView.separated(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: mockHistoryOrders.length,
      separatorBuilder: (_, _) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return OrderCard(
          order: mockHistoryOrders[index],
          isActive: false,
          index: index,
        );
      },
    );
  }
}
