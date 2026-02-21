import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/utils/organic_blob_clipper.dart';

class InnerBlob extends StatelessWidget {
  final Color color;

  const InnerBlob({super.key, required this.color});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      width: 260,
      height: 260,
      child:
          ClipPath(
                clipper: OrganicBlobClipper(seed: 100),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        color.withValues(alpha: 0.25),
                        color.withValues(alpha: 0.15),
                      ],
                    ),
                  ),
                ),
              )
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .scaleXY(begin: 0.9, end: 1.1, duration: 4.seconds)
              .rotate(
                duration: 15.seconds,
                curve: Curves.linear,
                begin: 0,
                end: -1,
              ),
    );
  }
}
