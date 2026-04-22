import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../../core/constants/app_colors.dart';
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
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(25),
          border: Border.all(width: 2, color: AppColors.primaryDark),
        ),
        width: 200,
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            const Icon(Icons.storefront_rounded, color: AppColors.primaryDark),
            const SizedBox(width: 10),
            Expanded(child: Text(vendorDistance.vendor.name)),
            Text(MapUtils.formatDistance(vendorDistance.distance)),
          ],
        ),
      ).animate(delay: (80 * index).ms).fade().moveX(begin: 60, end: 0),
    );
  }
}
