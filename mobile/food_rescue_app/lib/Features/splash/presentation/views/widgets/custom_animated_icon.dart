import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class CustomAnimatedIcon extends StatelessWidget {
  final IconData icon;
  final Color color;
  final double? size;
  const CustomAnimatedIcon({
    super.key,
    required this.icon,
    required this.color,
    this.size,
  });

  @override
  Widget build(BuildContext context) {
    return Icon(icon, size: size ?? 100, color: color)
        .animate()
        .scale(duration: 800.ms, curve: Curves.elasticOut)
        .fadeIn(duration: 600.ms);
  }
}
