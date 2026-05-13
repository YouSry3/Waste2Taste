import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/utils/app_routes.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'custom_card_widget.dart';

class VendorCard extends StatelessWidget {
  const VendorCard({
    super.key,
    required this.vendorName,
    required this.vendorId,
    this.latitude,
    this.longitude,
  });
  final String vendorName;
  final String vendorId;
  final double? latitude;
  final double? longitude;

  @override
  Widget build(BuildContext context) {
    return CustomCardWidget(
      paddingValue: 0,
      widget: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(vendorName, style: AppTextStyles.label(context)),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: AppColors.primary.withValues(alpha: .1),
          child: Text(
            vendorName.isNotEmpty ? vendorName[0].toUpperCase() : "",
            style: AppTextStyles.label(
              context,
            ).copyWith(color: AppColors.primary, fontSize: 18),
          ),
        ),
        subtitle: Row(
          children: [
            Icon(
              LucideIcons.shoppingBag,
              size: 12,
              color: AppColors.textMuted(context),
            ),
            const SizedBox(width: 4),
            Text(
              context.loc.viewOffer,
              style: AppTextStyles.body(
                context,
              ).copyWith(color: AppColors.primary, fontSize: 12),
            ),
          ],
        ),
        onTap: () {
          GoRouter.of(context).push(
            AppRoutes.vendorProductsView,
            extra: {'vendorId': vendorId, 'vendorName': vendorName},
          );
        },
      ),
    );
  }
}
