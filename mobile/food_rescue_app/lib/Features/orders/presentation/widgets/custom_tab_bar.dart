import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_text_styles.dart';

class CustomTabBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomTabBar({super.key});

  @override
  Widget build(BuildContext context) {
    return TabBar(
      labelColor: AppColors.primary,
      unselectedLabelColor: Colors.grey,
      indicatorColor: AppColors.primary,
      indicatorWeight: 3,
      labelStyle: AppTextStyles.button,
      tabs: const [
        Tab(text: "Active"),
        Tab(text: "History"),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(49);
}
