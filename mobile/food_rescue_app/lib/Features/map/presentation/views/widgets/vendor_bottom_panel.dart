import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../data/models/vendor_distance.dart';
import 'vendor_map_card.dart';

class VendorBottomPanel extends StatelessWidget {
  final List<VendorDistance> vendors;
  final void Function(VendorDistance) onVendorTap;

  const VendorBottomPanel({
    super.key,
    required this.vendors,
    required this.onVendorTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 10),
        SizedBox(
          height: 90,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: vendors.length,
            padding: EdgeInsets.symmetric(horizontal: 13),
            itemBuilder: (context, index) => VendorMapCard(
              vendorDistance: vendors[index],
              onTap: () => onVendorTap(vendors[index]),
              index: index,
            ),
            separatorBuilder: (BuildContext context, int index) =>
                SizedBox(width: 10),
          ),
        ),
      ],
    ).animate().moveY(begin: 300, end: 0, duration: 500.ms);
  }
}
