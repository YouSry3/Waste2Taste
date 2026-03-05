import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'setting_nav_item.dart';
import 'setting_swich_item.dart';
import 'settings_section.dart';

class GeneralSection extends StatelessWidget {
  const GeneralSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SettingsSection(
      title: "General",
      children: [
        SettingsNavItem(
          icon: LucideIcons.globe,
          label: "Language",
          trailingText: "English",
          onTap: () {},
        ),
        SettingsSwitchItem(
          icon: LucideIcons.moon,
          label: "Dark Mode",
          value: true,
          onChanged: (val) {},
        ),
      ],
    );
  }
}
