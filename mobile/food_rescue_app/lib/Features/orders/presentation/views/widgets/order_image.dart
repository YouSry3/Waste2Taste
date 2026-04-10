import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class OrderImage extends StatelessWidget {
  final String imageUrl;

  const OrderImage({super.key, required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        width: 80,
        height: 80,
        fit: BoxFit.cover,
        placeholder: (_, _) => Container(
          color: Colors.grey[100],
          child: const Icon(LucideIcons.image, color: Colors.grey),
        ),
      ),
    );
  }
}
