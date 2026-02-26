import 'package:flutter/material.dart';
import '../../../../../core/constants/app_text_styles.dart';

class IconLabel extends StatelessWidget {
  const IconLabel({super.key, required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          label,
          style: AppTextStyles.body.copyWith(color: Colors.grey, fontSize: 13),
        ),
      ],
    );
  }
}
