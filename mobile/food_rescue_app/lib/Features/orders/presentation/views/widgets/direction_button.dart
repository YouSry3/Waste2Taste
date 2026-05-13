import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/utils/custom_snack_bar.dart';
import 'package:waste2taste/core/utils/map_utils.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class DirectionsButton extends StatelessWidget {
  final double vendorLat;
  final double vendorLng;

  const DirectionsButton({
    super.key,
    required this.vendorLat,
    required this.vendorLng,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () async {
        CustomSnackBar.show(
          context: context,
          message: context.loc.openingVendorLocation,
          type: SnackBarType.info,
        );
        await MapUtils.openMaps(context, LatLng(vendorLat, vendorLng));
      },
      icon: const Icon(LucideIcons.mapPin, size: 16),
      label: Text(context.loc.directions),
      style: ElevatedButton.styleFrom(
        backgroundColor: Theme.of(context).colorScheme.onTertiaryContainer,
        foregroundColor: Theme.of(context).colorScheme.onTertiary,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
