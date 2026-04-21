import 'package:flutter/material.dart';

import '../../../../../core/constants/app_colors.dart';

class SettingsSwitchItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool? value;
  final ValueChanged<bool>? onChanged;
  final Widget? trailing;

  const SettingsSwitchItem({
    super.key,
    required this.icon,
    required this.label,
     this.value,
     this.onChanged,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.primary, size: 20),
      ),
      title: Text(
        label,
        style: TextStyle(
          color: Theme.of(context).colorScheme.onSurface,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing:
          trailing ??
          Switch(
            value: value??false,
            onChanged: onChanged??(b){},
            activeThumbColor: AppColors.primary,
          ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }
}
