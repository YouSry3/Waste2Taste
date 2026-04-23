import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class ReviewsAppBar extends StatelessWidget implements PreferredSizeWidget {
  const ReviewsAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    final languageCode = Localizations.localeOf(context).languageCode;
    final bool isArabic = languageCode == 'ar';
    return AppBar(
      centerTitle: true,
      title: Text(context.loc.reviews),
      backgroundColor: Theme.of(context).colorScheme.surface,
      elevation: 0,
      leading: IconButton(
        icon: Icon(
          isArabic ? LucideIcons.arrowRight : LucideIcons.arrowLeft,
          color: Theme.of(context).colorScheme.onSurface,
        ),
        onPressed: () => GoRouter.of(context).pop(),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
