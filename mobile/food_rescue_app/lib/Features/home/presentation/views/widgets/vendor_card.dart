import 'package:flutter/material.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import 'custom_card_widget.dart';

class VendorCard extends StatelessWidget {
  const VendorCard({super.key, required this.vendorName});
  final String vendorName;

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
            style: AppTextStyles.label(context).copyWith(
              color: AppColors.primary,
              fontSize: 18,
            ),
          ),
        ),
      ),
    );
  }
}
