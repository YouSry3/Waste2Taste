import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class CustomSliverAppBar extends StatelessWidget {
  const CustomSliverAppBar({
    super.key,
    required this.widget,
    this.toolbarHeight = 48,
    this.tabBar,
    this.onBackPressed,
  });
  final Widget widget;
  final double toolbarHeight;
  final PreferredSizeWidget? tabBar;
  final VoidCallback? onBackPressed;

  @override
  Widget build(BuildContext context) {
    final languageCode = Localizations.localeOf(context).languageCode;
    final bool isArabic = languageCode == 'ar';

    return SliverAppBar(
      pinned: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      floating: true,
      toolbarHeight: toolbarHeight,
      centerTitle: true,
      title: widget,
      bottom: tabBar,
      leading: onBackPressed != null
          ? IconButton(
              icon: Icon(isArabic ? LucideIcons.arrowRight : LucideIcons.arrowLeft),
              onPressed: onBackPressed,
            )
          : null,
    );
  }
}
