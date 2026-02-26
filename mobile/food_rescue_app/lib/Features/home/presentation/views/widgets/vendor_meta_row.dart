import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'icon_label.dart';

class VendorMetaRow extends StatelessWidget {
  const VendorMetaRow({
    super.key,
    required this.vendorName,
    required this.distance,
  });
  final String vendorName;
  final String distance;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconLabel(icon: LucideIcons.store, label: vendorName),
        const SizedBox(width: 12),
        IconLabel(icon: LucideIcons.mapPin, label: distance),
      ],
    );
  }
}
