import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';

class CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final Color? color;

  const CircleIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      backgroundColor: Colors.white,
      radius: 22,
      child: IconButton(
        icon: Icon(icon, color: color ?? AppColors.textDark, size: 20),
        onPressed: onPressed,
        splashRadius: 22,
      ),
    );
  }
}
