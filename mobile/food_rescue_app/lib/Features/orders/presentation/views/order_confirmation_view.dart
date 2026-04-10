import 'package:flutter/material.dart';
import 'widgets/order_confirmation_view_body.dart';

class OrderConfirmationView extends StatelessWidget {
  const OrderConfirmationView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: OrderConfirmationViewBody());
  }
}
