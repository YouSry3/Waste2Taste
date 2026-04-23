import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:waste2taste/core/utils/app_routes.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import 'custom_card_widget.dart';

class VendorCard extends StatelessWidget {
  const VendorCard({super.key, required this.vendorName, required this.vendorId});
  final String vendorName;
  final String vendorId;

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
        trailing: PopupMenuButton<String>(
          onSelected: (value) {
            if (value == 'report') {
              GoRouter.of(context).push(AppRoutes.reportVendorView,extra: vendorId);
            }
          },
          itemBuilder: (context) => [
            PopupMenuItem(
              value: 'report',
              child: Text(context.loc.reportThisVendor),
            ),
          ],
          icon: const Icon(Icons.more_vert_outlined),
        ),
      ),
    );
  }
}
