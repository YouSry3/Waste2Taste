import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';

class CustomSliverAppBar extends StatelessWidget {
  const CustomSliverAppBar({super.key, required this.widget});
  final Widget widget;
  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      backgroundColor: AppColors.background,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      floating: true,
      toolbarHeight: 90,
      centerTitle: true,
      title: widget,
    );
  }
}
