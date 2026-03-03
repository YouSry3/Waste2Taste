import 'package:flutter/material.dart';

class PillBadge extends StatelessWidget {
  const PillBadge({super.key, required this.color, required this.child});
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: child,
    );
  }
}
