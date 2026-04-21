import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class CustomerCard extends StatelessWidget {
  const CustomerCard({
    super.key,
    required this.userName,
    required this.location,
    required this.profileImageUrl,
  });

  final String userName;
  final String location;
  final String profileImageUrl;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.all(7),
      title: Text(
        context.loc.helloUser(userName),
        style: AppTextStyles.title(context).copyWith(
          // fontWeight: FontWeight.normal,
          // color: AppColors.textGray,
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
            style: AppTextStyles.subtitle(
              context,
            ).copyWith(wordSpacing: 2, fontSize: 16),
          ),
        ],
      ),
      trailing: CircleAvatar(
        radius: 24,
        child: CircleAvatar(
          radius: 22,
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
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
