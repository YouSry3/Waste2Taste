import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class RoundedTopImage extends StatelessWidget {
  const RoundedTopImage({super.key, required this.imageUrl});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        height: 180,
        width: double.infinity,
        fit: BoxFit.cover,
      ),
    );
  }
}
