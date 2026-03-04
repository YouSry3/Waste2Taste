import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../data/models/profile_menu_item_model.dart';

class ProfileItem extends StatelessWidget {
  const ProfileItem({super.key, required this.item});
  final ProfileMenuItemModel item;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => item.onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: item.color.withValues(alpha: .1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(item.icon, color: item.color, size: 22),
      ),
      title: Text(
        item.label,
        style: AppTextStyles.button.copyWith(color: AppColors.textDark),
      ),
      trailing: const Icon(
        LucideIcons.chevronRight,
        size: 20,
        color: Colors.grey,
      ),
    );
  }
}
