import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/extensions/app_localization_extention.dart';

class DirectionsButton extends StatelessWidget {
  const DirectionsButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(context.loc.openingMaps)));
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
