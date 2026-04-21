import 'package:flutter/material.dart';

class IconCircle extends StatelessWidget {
  final IconData icon;
  final Color color;

  const IconCircle({super.key, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }
}
