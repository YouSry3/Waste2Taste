import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';

class UiMappers {
  static IconData toIcon(String iconName) {
    switch (iconName) {
      case 'utensils':
        return LucideIcons.utensils;
      case 'shoppingBag':
        return LucideIcons.shoppingBag;
      case 'heart':
        return LucideIcons.heart;
      default:
        return LucideIcons.circle;
    }
  }

  static Color toColor(String colorName) {
    switch (colorName) {
      case 'primary':
        return AppColors.primary;
      case 'secondary':
        return AppColors.secondary;
      case 'accent':
        return AppColors.accent;
      default:
        return AppColors.primary;
    }
  }
}
