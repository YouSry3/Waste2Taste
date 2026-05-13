import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/enums/order_status.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../manager/get_my_orders_cubit/get_my_orders_cubit.dart';
import '../../manager/get_my_orders_cubit/get_my_orders_state.dart';
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
    return BlocBuilder<GetMyOrdersCubit, GetMyOrdersState>(
      builder: (context, state) {
        if (state is GetMyOrdersLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (state is GetMyOrdersSuccess) {
          final orders = state.orders
              .where((order) =>
                  order.status == OrderStatus.pending ||
                  order.status == OrderStatus.readyForPickup)
              .toList();
          if (orders.isEmpty) {
            return Center(child: Text(context.loc.noActiveOrders));
          }
          return ListView.separated(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            separatorBuilder: (_, _) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              return OrderCard(
                order: orders[index],
                isActive: true,
                index: index,
              );
            },
          );
        } else if (state is GetMyOrdersFailure) {
          return Center(child: Text(state.errorMessage));
        }
        return const SizedBox.shrink();
      },
    );
  }

  @override
  bool get wantKeepAlive => true;
}
