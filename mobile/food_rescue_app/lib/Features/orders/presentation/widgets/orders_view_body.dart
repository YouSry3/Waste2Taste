import 'package:flutter/material.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/constants/app_text_styles.dart';
import '../../../../core/widgets/custom_sliver_app_bar.dart';
import '../../data/models/order_model.dart';
import 'active_tab.dart';
import 'custom_tab_bar.dart';
import 'history_tab.dart';

class OrdersViewBody extends StatelessWidget {
  const OrdersViewBody({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: CustomScrollView(
        slivers: [
          CustomSliverAppBar(
            widget: Text(AppStrings.myOrders, style: AppTextStyles.appBarTitle),
            tabBar: const CustomTabBar(),
          ),
          const SliverFillRemaining(
            child: TabBarView(children: [ActiveTab(), HistoryTab()]),
          ),
        ],
      ),
    );
  }
}
