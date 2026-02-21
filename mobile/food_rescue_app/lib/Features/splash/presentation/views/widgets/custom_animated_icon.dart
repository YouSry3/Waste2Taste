import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class CustomAnimatedIcon extends StatelessWidget {
  final IconData icon;
  final Color color;

  const CustomAnimatedIcon({super.key, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Icon(icon, size: 100, color: color)
        .animate()
        .scale(duration: 800.ms, curve: Curves.elasticOut)
        .fadeIn(duration: 600.ms);
  }
}
