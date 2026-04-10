import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'setting_nav_item.dart';
import 'settings_section.dart';

class SecuritySection extends StatelessWidget {
  const SecuritySection({super.key});

  @override
  Widget build(BuildContext context) {
    return SettingsSection(
      title: context.loc.security,
      children: [
        SettingsNavItem(
          icon: LucideIcons.lock,
          label: context.loc.changePassword,
          onTap: () {},
        ),
      ],
    );
  }
}
