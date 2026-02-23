import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';
import '../enums/color_name.dart';
import '../enums/icon_name.dart';

class UiMappers {
  static IconData toIcon(IconName iconName) {
    switch (iconName) {
      case IconName.utensils:
        return LucideIcons.utensils;
      case IconName.shoppingBag:
        return LucideIcons.shoppingBag;
      case IconName.heart:
        return LucideIcons.heart;
    }
  }

  static Color toColor(ColorName colorName) {
    switch (colorName) {
      case ColorName.primary:
        return AppColors.primary;
      case ColorName.secondary:
        return AppColors.secondary;
      case ColorName.accent:
        return AppColors.accent;
    }
  }
}
