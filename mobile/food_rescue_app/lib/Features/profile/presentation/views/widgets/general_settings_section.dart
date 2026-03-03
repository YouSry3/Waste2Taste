import 'package:flutter/material.dart';
import '../../../data/models/profile_menu_item_model.dart';
import 'profile_menu_section.dart';

class GeneralSettingsSection extends StatelessWidget {
  const GeneralSettingsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ProfileMenuSection(items: generalSettings);
  }
}
