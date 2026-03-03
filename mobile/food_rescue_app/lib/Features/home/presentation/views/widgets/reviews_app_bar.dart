import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ReviewsAppBar extends StatelessWidget implements PreferredSizeWidget {
  const ReviewsAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text("Reviews"),
      backgroundColor: Colors.white,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(LucideIcons.arrowLeft, color: Colors.black),
        onPressed: () => Navigator.pop(context),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
