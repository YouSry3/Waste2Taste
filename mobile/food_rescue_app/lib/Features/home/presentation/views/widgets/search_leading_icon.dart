import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/constants/app_colors.dart';

class SearchLeadingIcon extends StatelessWidget {
  const SearchLeadingIcon({super.key});

  @override
  Widget build(BuildContext context) {
    return const Icon(LucideIcons.search, color: AppColors.primary, size: 22);
  }
}
