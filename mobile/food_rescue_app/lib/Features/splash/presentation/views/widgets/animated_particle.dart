import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/enums/particle_animation_type.dart';

class AnimatedParticle extends StatelessWidget {
  final Color color;
  final double size;
  final double? top;
  final double? bottom;
  final double? left;
  final double? right;
  final ParticleAnimationType animationType;

  const AnimatedParticle({
    super.key,
    required this.color,
    required this.size,
    this.top,
    this.bottom,
    this.left,
    this.right,
    required this.animationType,
  });

  @override
  Widget build(BuildContext context) {
    Widget particle = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );

    switch (animationType) {
      case ParticleAnimationType.scaleAndMoveY:
        particle = particle
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .scaleXY(begin: 0.8, end: 1.2, duration: 2.seconds)
            .moveY(begin: 0, end: -10, duration: 3.seconds);
        break;

      case ParticleAnimationType.scaleAndMoveX:
        particle = particle
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .scaleXY(begin: 0.5, end: 1.0, duration: 4.seconds)
            .moveX(begin: 0, end: 10, duration: 5.seconds);
        break;

      case ParticleAnimationType.pop:
        particle = particle
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .fadeIn(duration: 1.seconds)
            .scaleXY(
              begin: 0,
              end: 1,
              duration: 2.seconds,
              curve: Curves.elasticOut,
            );
        break;
    }

    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      child: particle,
    );
  }
}
