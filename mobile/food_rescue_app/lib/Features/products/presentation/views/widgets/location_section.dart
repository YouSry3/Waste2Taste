import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/Features/home/domain/entities/product_entity.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../../core/extensions/app_localization_extention.dart';
import '../../../../home/presentation/views/widgets/custom_card_widget.dart';
import '../../../../../core/utils/app_routes.dart';

class LocationSection extends StatelessWidget {
  const LocationSection({super.key, required this.product});
  final ProductEntity product;

  @override
  Widget build(BuildContext context) {
    return CustomCardWidget(
      paddingValue: 0,
      widget: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: const Icon(LucideIcons.mapPin, color: AppColors.primary),
        title: Text(product.vendorName, style: AppTextStyles.label(context)),
        subtitle: Text(
          context.loc.directions,
          style: AppTextStyles.body(context).copyWith(
            color: AppColors.primary,
            fontSize: 12,
          ),
        ),
        trailing: const Icon(
          LucideIcons.chevronRight,
          color: AppColors.textGray,
        ),
        onTap: () => _navigateToMap(context),
      ),
    );
  }

  void _navigateToMap(BuildContext context) {
    // Navigate to the vendor products view which will show the vendor's
    // products and from there they can navigate to the map
    GoRouter.of(context).push(
      AppRoutes.vendorProductsView,
      extra: {
        'vendorId': product.vendorId,
        'vendorName': product.vendorName,
      },
    );
  }
}
