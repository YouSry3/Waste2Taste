import '../../../../core/enums/color_name.dart';
import '../../../../core/enums/icon_name.dart';

class OnboardingEntity {
  final IconName iconName;
  final String titleKey;
  final String descriptionKey;
  final ColorName colorName;

  OnboardingEntity({
    required this.iconName,
    required this.colorName,
    required this.titleKey,
    required this.descriptionKey,
  });
}
