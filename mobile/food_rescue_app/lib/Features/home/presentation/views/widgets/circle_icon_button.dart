import 'package:flutter/material.dart';

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
      backgroundColor: Theme.of(context).colorScheme.surface,
      radius: 22,
      child: IconButton(
        icon: Icon(icon, color: color ?? Theme.of(context).colorScheme.onSurface, size: 20),
        onPressed: onPressed,
        splashRadius: 22,
      ),
    );
  }
}
