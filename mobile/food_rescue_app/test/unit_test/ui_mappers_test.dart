import 'package:flutter_test/flutter_test.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:waste2taste/core/constants/app_colors.dart';
import 'package:waste2taste/core/enums/color_name.dart';
import 'package:waste2taste/core/enums/icon_name.dart';
import 'package:waste2taste/core/mappers/ui_mappers.dart';

void main() {
  group('UiMappers tests', () {
    test('toIcon should map IconName values to correct LucideIcons', () {
      expect(UiMappers.toIcon(IconName.utensils), LucideIcons.utensils);
      expect(UiMappers.toIcon(IconName.shoppingBag), LucideIcons.shoppingBag);
      expect(UiMappers.toIcon(IconName.heart), LucideIcons.heart);
    });

    test('toColor should map ColorName values to correct AppColors', () {
      expect(UiMappers.toColor(ColorName.primary), AppColors.primary);
      expect(UiMappers.toColor(ColorName.secondary), AppColors.secondary);
      expect(UiMappers.toColor(ColorName.accent), AppColors.accent);
    });
  });
}
