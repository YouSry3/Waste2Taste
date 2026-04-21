import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

import 'icon_circle.dart';

class SettingsNavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;
  final String? trailingText;

  const SettingsNavItem({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
    this.trailingText,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isRTL = Directionality.of(context) == TextDirection.rtl;
    return ListTile(
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      leading: IconCircle(icon: icon, color: color),
      title: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailingText != null)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Text(
                trailingText!,
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ),
          Icon(
            isRTL ? LucideIcons.chevronLeft : LucideIcons.chevronRight,
            size: 20,
            color: Colors.grey[400],
          ),
        ],
      ),
    );
  }
}
