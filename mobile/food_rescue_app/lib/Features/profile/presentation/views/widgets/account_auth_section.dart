import 'package:flutter/material.dart';
import '../../../data/models/profile_menu_item_model.dart';
import 'profile_menu_section.dart';

class AccountAuthSection extends StatelessWidget {
  const AccountAuthSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ProfileMenuSection(items: accountAuth);
  }
}
