import 'package:flutter/material.dart';

class OrganicBlobClipper extends CustomClipper<Path> {
  final int seed;
  OrganicBlobClipper({this.seed = 0});

  @override
  Path getClip(Size size) {
    Path path = Path();
    final w = size.width;
    final h = size.height;

    if (seed == 0) {
      path.moveTo(w * 0.5, 0);
      path.cubicTo(w * 0.8, h * 0.1, w, h * 0.3, w * 0.9, h * 0.6);
      path.cubicTo(w * 0.8, h * 0.9, w * 0.5, h, w * 0.2, h * 0.8);
      path.cubicTo(0, h * 0.6, 0, h * 0.3, w * 0.3, h * 0.1);
      path.cubicTo(w * 0.4, 0, w * 0.5, 0, w * 0.5, 0);
    } else {
      path.moveTo(w * 0.3, 0.05 * h);
      path.cubicTo(w * 0.8, 0, w, h * 0.4, w * 0.8, h * 0.7);
      path.cubicTo(w * 0.6, h, w * 0.3, h * 0.9, w * 0.1, h * 0.6);
      path.cubicTo(0, h * 0.4, 0.1 * w, h * 0.1, w * 0.3, 0.05 * h);
    }

    path.close();
    return path;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) {
    return false;
  }
}
