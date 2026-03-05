import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

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
    this.color = AppColors.textDark,
  });

  @override
  Widget build(BuildContext context) {
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
          Icon(LucideIcons.chevronRight, size: 20, color: Colors.grey[400]),
        ],
      ),
    );
  }
}

class IconCircle extends StatelessWidget {
  final IconData icon;
  final Color color;

  const IconCircle({super.key, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }
}
