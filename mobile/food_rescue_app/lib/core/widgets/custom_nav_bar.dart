import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../constants/app_strings.dart';
import 'nav_bar_item.dart';

class CustomNavBar extends StatelessWidget {
  final int currentIndex;
  final void Function(int) onTap;

  const CustomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade200)),
      ),
      padding: EdgeInsets.fromLTRB(
        24,
        12,
        24,
        12 + MediaQuery.of(context).padding.bottom,
      ),
      child: Row(children: navBarList),
    );
  }

  List<Widget> get navBarList {
    return [
      NavBarItem(
        icon: LucideIcons.home,
        label: AppStrings.navHome,
        index: 0,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.map,
        label: AppStrings.navMap,
        index: 1,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.shoppingBag,
        label: AppStrings.navOrders,
        index: 2,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.user,
        label: AppStrings.navProfile,
        index: 3,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
    ];
  }
}
