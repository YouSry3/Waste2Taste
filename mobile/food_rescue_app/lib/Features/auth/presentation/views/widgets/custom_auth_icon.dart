import 'package:flutter/material.dart';
import '../../../../../core/widgets/custom_animated_icon.dart';

class CustomAuthIcon extends StatelessWidget {
  const CustomAuthIcon({super.key, required this.icon, required this.color});
  final IconData icon;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: ColoredBox(
          color: color.withValues(alpha: 0.1),
          child: SizedBox(
            width: 80,
            height: 80,
            child: CustomAnimatedIcon(icon: icon, size: 40, color: color),
          ),
        ),
      ),
    );
  }
}
