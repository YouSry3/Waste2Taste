import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'setting_nav_item.dart';
import 'settings_section.dart';

class DangerSection extends StatelessWidget {
  const DangerSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SettingsSection(
      title: context.loc.dangerZone,
      children: [
        SettingsNavItem(
          icon: LucideIcons.trash2,
          label: context.loc.deleteAccount,
          color: Colors.red,
          onTap: () {},
        ),
      ],
    );
  }
}
