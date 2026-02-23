import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'custom_auth_icon.dart';

class LoginViewBodyComponents extends StatelessWidget {
  const LoginViewBodyComponents({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [const CustomAuthIcon(icon: LucideIcons.user)],
      ),
    );
  }
}
