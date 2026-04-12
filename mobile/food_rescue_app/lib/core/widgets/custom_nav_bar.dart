import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../extensions/app_localization_extention.dart';
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
        color: Theme.of(context).colorScheme.surface,
        border: Border(top: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
      ),
      padding: EdgeInsets.fromLTRB(
        24,
        12,
        24,
        12 + MediaQuery.of(context).padding.bottom,
      ),
      child: Row(children: navBarList(context)),
    );
  }

  List<Widget> navBarList(BuildContext context) {
    return [
      NavBarItem(
        icon: LucideIcons.home,
        label: context.loc.navHome,
        index: 0,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.map,
        label: context.loc.navMap,
        index: 1,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.shoppingBag,
        label: context.loc.navOrders,
        index: 2,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
      NavBarItem(
        icon: LucideIcons.user,
        label: context.loc.navProfile,
        index: 3,
        currentIndex: currentIndex,
        onTap: onTap,
      ),
    ];
  }
}
