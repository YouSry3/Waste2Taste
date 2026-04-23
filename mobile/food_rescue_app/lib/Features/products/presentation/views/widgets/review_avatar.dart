import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../../../core/constants/api_urls.dart';
import '../../../../../core/constants/app_colors.dart';

class ReviewAvatar extends StatelessWidget {
  final String? imageUrl;
  final String name;

  const ReviewAvatar({super.key, required this.imageUrl, required this.name});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: AppColors.primary.withValues(alpha: 0.2),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: CircleAvatar(
        radius: 22,
        backgroundColor: AppColors.primary.withValues(alpha: 0.08),
        child: ClipOval(
          child: CachedNetworkImage(
            imageUrl: imageUrl == null ? '' : ApiUrls.baseUrl + imageUrl!,
            width: 44,
            height: 44,
            fit: BoxFit.cover,
            errorWidget: (context, url, error) => Center(
              child: Text(
                name.isNotEmpty ? name[0].toUpperCase() : '?',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
