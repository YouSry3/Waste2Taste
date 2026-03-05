import 'package:flutter/material.dart';
import 'widgets/saved_orders_view_body.dart';

class SavedOrdersView extends StatelessWidget {
  const SavedOrdersView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: SavedOrdersViewBody());
  }
}
