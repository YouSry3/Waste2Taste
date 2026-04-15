import 'package:animated_theme_switcher/animated_theme_switcher.dart';
import 'package:flutter/material.dart';
import 'widgets/general_settings_view_body.dart';

class GeneralSettingsView extends StatelessWidget {
  const GeneralSettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    return ThemeSwitchingArea(
      child: const Scaffold(body: GeneralSettingsViewBody()),
    );
  }
}
