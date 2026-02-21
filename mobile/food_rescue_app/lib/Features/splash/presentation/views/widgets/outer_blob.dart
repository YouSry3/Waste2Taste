import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/utils/organic_blob_clipper.dart';

class OuterBlob extends StatelessWidget {
  final Color color;

  const OuterBlob({super.key, required this.color});

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child:
          Transform.rotate(
                angle: -math.pi / 4,
                child: ClipPath(
                  clipper: OrganicBlobClipper(),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          color.withValues(alpha: 0.15),
                          color.withValues(alpha: 0.05),
                        ],
                      ),
                    ),
                  ),
                ),
              )
              .animate(onPlay: (c) => c.repeat())
              .rotate(duration: 20.seconds, curve: Curves.linear),
    );
  }
}
