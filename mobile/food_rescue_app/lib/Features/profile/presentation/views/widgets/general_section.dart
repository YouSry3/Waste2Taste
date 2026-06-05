import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/keys.dart';
import 'package:waste2taste/core/database/pref_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../../core/cubits/theme_cubit/theme_cubit.dart';
import 'distance_offers_sheet.dart';
import 'language_sheet.dart';
import 'setting_nav_item.dart';
import 'setting_swich_item.dart';
import 'settings_section.dart';
import 'theme_switcher_widget.dart';

class GeneralSection extends StatefulWidget {
  const GeneralSection({super.key});

  @override
  State<GeneralSection> createState() => _GeneralSectionState();
}

class _GeneralSectionState extends State<GeneralSection> {
  late double _maxDistance;

  @override
  void initState() {
    super.initState();
    _maxDistance = getIt.get<PrefsService>().getDouble(kDistanceOffersKey) ?? 30.0;
  }

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

  void _showDistanceSheet(BuildContext context) async {
    final result = await showModalBottomSheet<double>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return DistanceOffersSheet(initialDistance: _maxDistance);
      },
    );

    if (result != null) {
      await getIt.get<PrefsService>().setDouble(kDistanceOffersKey, result);
      setState(() {
        _maxDistance = result;
      });
    }
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
        SettingsNavItem(
          icon: LucideIcons.mapPin,
          label: context.loc.maxDistance,
          color: Theme.of(context).colorScheme.onSurface,
          trailingText: _maxDistance >= 100 ? "None" : "${_maxDistance.round()} km",
          onTap: () => _showDistanceSheet(context),
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
