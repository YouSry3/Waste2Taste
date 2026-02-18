import 'package:flutter/material.dart';
import 'animated_leaf.dart';

class LeavesBackground extends StatelessWidget {
  const LeavesBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: List.generate(
        5,
        (index) => AnimatedLeaf(
          left: (index * 80),
          top: (index * 120),
          duration: Duration(seconds: 2 + index),
        ),
      ),
    );
  }
}
