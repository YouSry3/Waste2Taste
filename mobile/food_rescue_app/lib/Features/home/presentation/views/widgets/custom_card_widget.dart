import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';

class CustomCardWidget extends StatelessWidget {
  const CustomCardWidget({super.key, required this.widget, this.paddingValue});
  final Widget widget;
  final double? paddingValue;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppColors.surface,
      elevation: 4,
      shadowColor: Colors.black.withValues(alpha: 0.5),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: EdgeInsets.all(paddingValue ?? 16),
        child: widget,
      ),
    );
  }
}
