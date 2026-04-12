import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/theme/theme_cubit.dart';
import 'setting_nav_item.dart';
import 'setting_swich_item.dart';
import 'settings_section.dart';

class GeneralSection extends StatelessWidget {
  const GeneralSection({super.key});

  @override
  Widget build(BuildContext context) {
    final languageCode = Localizations.localeOf(context).languageCode;
    final bool isArabic = languageCode == 'ar';
    final themeState = context.watch<ThemeCubit>().state;

    return SettingsSection(
      title: context.loc.general,
      children: [
        SettingsNavItem(
          icon: LucideIcons.globe,
          label: context.loc.language,
          trailingText: isArabic ? "اللغة العربية" : "English",
          onTap: () {},
        ),
        SettingsSwitchItem(
          icon: LucideIcons.moon,
          label: context.loc.darkMode,
          value: themeState.themeMode == AppThemeMode.dark,
          onChanged: (_) => context.read<ThemeCubit>().toggleTheme(),
        ),
      ],
    );
  }
}