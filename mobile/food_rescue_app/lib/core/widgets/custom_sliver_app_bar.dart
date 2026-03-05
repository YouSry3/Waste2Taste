import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class CustomSliverAppBar extends StatelessWidget {
  const CustomSliverAppBar({
    super.key,
    required this.widget,
    this.toolbarHeight = 48,
    this.tabBar,
  });
  final Widget widget;
  final double toolbarHeight;
  final PreferredSizeWidget? tabBar;
  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      backgroundColor: AppColors.background,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      floating: true,
      toolbarHeight: toolbarHeight,
      centerTitle: true,
      title: widget,
      bottom: tabBar,
    );
  }
}
