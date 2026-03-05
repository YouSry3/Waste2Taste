import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'setting_nav_item.dart';
import 'settings_section.dart';

class SecuritySection extends StatelessWidget {
  const SecuritySection({super.key});

  @override
  Widget build(BuildContext context) {
    return SettingsSection(
      title: "Security",
      children: [
        SettingsNavItem(
          icon: LucideIcons.lock,
          label: "Change Password",
          onTap: () {},
        ),
      ],
    );
  }
}
