import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class RoundedTopImage extends StatelessWidget {
  const RoundedTopImage({
    super.key,
    required this.imageUrl,
    required this.heroTag,
  });
  final String imageUrl;
  final String heroTag;

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: heroTag,
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        child: CachedNetworkImage(
          imageUrl: imageUrl,
          height: 180,
          width: double.infinity,
          fit: BoxFit.cover,
          fadeInDuration: const Duration(milliseconds: 400),
          fadeOutDuration: const Duration(milliseconds: 200),
        ),
      ),
    );
  }
}
