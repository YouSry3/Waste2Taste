import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/app_text_styles.dart';
import '../../../../../core/constants/app_colors.dart';

class CustomSliverAppBar extends StatelessWidget {
  final String userName;
  final String location;
  final String profileImageUrl;

  const CustomSliverAppBar({
    super.key,
    required this.userName,
    required this.location,
    required this.profileImageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      backgroundColor: AppColors.background,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      floating: true,
      toolbarHeight: 90,
      title: ListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(
          'Hello, $userName 👋',
          style: AppTextStyles.label.copyWith(
            fontWeight: FontWeight.normal,
            color: AppColors.textGray,
            wordSpacing: 2,
            height: 2,
            fontSize: 16,
          ),
        ),
        subtitle: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.mapPin, size: 24, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              location,
              style: AppTextStyles.appBarTitle.copyWith(
                wordSpacing: 2,
                fontSize: 16,
              ),
            ),
          ],
        ),
        trailing: CircleAvatar(
          radius: 22,
          backgroundColor: Colors.grey.shade200,
          child: CachedNetworkImage(
            imageUrl: profileImageUrl,
            errorWidget: (context, url, error) =>
                const Icon(Icons.person, color: AppColors.primary),
          ),
        ),
      ),
    );
  }
}
