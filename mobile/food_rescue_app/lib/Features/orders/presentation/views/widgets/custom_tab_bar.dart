import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

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
      tabs: [
        Tab(text: context.loc.active),
        Tab(text: context.loc.history),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(49);
}
