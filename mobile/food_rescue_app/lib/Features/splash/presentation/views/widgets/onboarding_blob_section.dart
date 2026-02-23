import 'package:flutter/material.dart';
import '../../../../../core/enums/particle_animation_type.dart';
import 'animated_particle.dart';
import '../../../../../core/widgets/custom_animated_icon.dart';
import 'inner_blob.dart';
import 'outer_blob.dart';

class OnboardingBlobSection extends StatelessWidget {
  const OnboardingBlobSection({
    super.key,
    required this.color,
    required this.icon,
  });
  final Color color;
  final IconData icon;
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 330,
      height: 330,
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedParticle(
            color: color.withValues(alpha: 0.3),
            size: 20,
            top: 40,
            right: 40,
            animationType: ParticleAnimationType.scaleAndMoveY,
          ),
          AnimatedParticle(
            color: color.withValues(alpha: 0.2),
            size: 15,
            bottom: 60,
            left: 30,
            animationType: ParticleAnimationType.scaleAndMoveX,
          ),
          AnimatedParticle(
            color: color.withValues(alpha: 0.25),
            size: 12,
            bottom: 40,
            right: 60,
            animationType: ParticleAnimationType.pop,
          ),
          OuterBlob(color: color),
          InnerBlob(color: color),
          CustomAnimatedIcon(icon: icon, color: color),
        ],
      ),
    );
  }
}
