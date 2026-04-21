import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../../core/constants/app_colors.dart';
import '../../../../../core/constants/app_text_styles.dart';
import '../../../../home/data/models/product_model.dart';
import '../../../../home/presentation/views/widgets/custom_card_widget.dart';

class LocationSection extends StatelessWidget {
  const LocationSection({super.key, required this.product});
  final ProductModel product;

  @override
  Widget build(BuildContext context) {
    return CustomCardWidget(
      paddingValue: 0,
      widget: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: const Icon(LucideIcons.mapPin, color: AppColors.primary),
        title: Text(product.vendorName, style: AppTextStyles.label(context)),
        trailing: const Icon(
          LucideIcons.chevronRight,
          color: AppColors.textGray,
        ),
        onTap: () => _openMap(product),
      ),
    );
  }

  Future<void> _openMap(ProductModel product) async {
    final url = Uri.parse(
      "https://www.google.com/maps/search/?api=1&query=${product.latitude},${product.longitude}",
    );

    await launchUrl(url, mode: LaunchMode.externalApplication);
  }
}
