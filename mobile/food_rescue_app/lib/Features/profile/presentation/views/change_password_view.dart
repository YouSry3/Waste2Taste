import 'package:flutter/material.dart';
import '../../../../core/extensions/app_localization_extention.dart';
import 'widgets/change_password_view_body.dart';

class ChangePasswordView extends StatelessWidget {
  const ChangePasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: ChangePasswordViewBody());
  }
}
