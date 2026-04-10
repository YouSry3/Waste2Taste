import 'package:flutter/material.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../data/models/order_model.dart';
import 'order_card.dart';

class ActiveTab extends StatefulWidget {
  const ActiveTab({super.key});

  @override
  State<ActiveTab> createState() => _ActiveTabState();
}

class _ActiveTabState extends State<ActiveTab>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    super.build(context);
    if (mockActiveOrders.isEmpty) {
      return Center(child: Text(context.loc.noActiveOrders));
    }

    return ListView.separated(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: mockActiveOrders.length,
      separatorBuilder: (_, _) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return OrderCard(
          order: mockActiveOrders[index],
          isActive: true,
          index: index,
        );
      },
    );
  }

  @override
  bool get wantKeepAlive => true;
}
