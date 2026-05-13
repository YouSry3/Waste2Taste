import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../manager/get_my_orders_cubit/get_my_orders_cubit.dart';
import 'widgets/orders_view_body.dart';

class OrdersView extends StatelessWidget {
  const OrdersView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt.get<GetMyOrdersCubit>()..getMyOrders(),
      child: const Scaffold(body: OrdersViewBody()),
    );
  }
}
