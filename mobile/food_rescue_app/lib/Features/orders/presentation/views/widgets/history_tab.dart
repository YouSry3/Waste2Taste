import 'package:flutter/material.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../data/models/order_model.dart';
import 'order_card.dart';

class HistoryTab extends StatefulWidget {
  const HistoryTab({super.key});

  @override
  State<HistoryTab> createState() => _HistoryTabState();
}

class _HistoryTabState extends State<HistoryTab>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    super.build(context);
    if (mockHistoryOrders.isEmpty) {
      return Center(child: Text(context.loc.noHistoryOrders));
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

  @override
  bool get wantKeepAlive => true;
}
