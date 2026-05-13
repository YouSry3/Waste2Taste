import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/utils/map_utils.dart';
import '../../../data/models/vendor_distance.dart';

class VendorMapCard extends StatelessWidget {
  final VendorDistance vendorDistance;
  final VoidCallback onTap;
  final int index;

  const VendorMapCard({
    super.key,
    required this.vendorDistance,
    required this.onTap,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final vendor = vendorDistance.vendor;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: Theme.of(context).colorScheme.surface,
          border: Border.all(
            width: 1.5,
            color: AppColors.primary.withValues(alpha: 0.3),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        width: 220,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        child: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: AppColors.primary.withValues(alpha: 0.1),
              child: Text(
                vendor.name.isNotEmpty ? vendor.name[0].toUpperCase() : "?",
                style: AppTextStyles.label(context).copyWith(
                  color: AppColors.primary,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    vendor.name,
                    style: AppTextStyles.label(context).copyWith(fontSize: 13),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.star,
                        size: 12,
                        color: AppColors.secondary,
                      ),
                      const SizedBox(width: 3),
                      Text(
                        vendor.rating.toStringAsFixed(1),
                        style: AppTextStyles.body(context).copyWith(
                          fontSize: 11,
                          color: AppColors.textMuted(context),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        LucideIcons.mapPin,
                        size: 12,
                        color: AppColors.textMuted(context),
                      ),
                      const SizedBox(width: 3),
                      Text(
                        MapUtils.formatDistance(vendorDistance.distance),
                        style: AppTextStyles.body(context).copyWith(
                          fontSize: 11,
                          color: AppColors.textMuted(context),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ).animate(delay: (80 * index).ms).fade().moveX(begin: 60, end: 0),
    );
  }
}
