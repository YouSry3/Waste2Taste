import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/cubits/theme_cubit/theme_cubit.dart';
import 'language_sheet.dart';
import 'setting_nav_item.dart';
import 'setting_swich_item.dart';
import 'settings_section.dart';
import 'theme_switcher_widget.dart';

class GeneralSection extends StatelessWidget {
  const GeneralSection({super.key});
  void _showLanguageSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return const LanguageSheet();
      },
    );
  }

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
          color: Theme.of(context).colorScheme.onSurface,
          trailingText: isArabic ? "العربية" : "English",
          onTap: () => _showLanguageSheet(context),
        ),
        SettingsSwitchItem(
          icon: LucideIcons.moon,
          label: context.loc.darkMode,
          value: themeState.themeMode == AppThemeMode.dark,
          trailing: ThemeSwicherWidget(themeState: themeState),
        ),
      ],
    );
  }
}
