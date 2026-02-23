import '../../../../core/enums/color_name.dart';
import '../../../../core/enums/icon_name.dart';

class OnboardingEntity {
  final IconName iconName;
  final String title;
  final String description;
  final ColorName colorName;

  OnboardingEntity({
    required this.iconName,
    required this.title,
    required this.description,
    required this.colorName,
  });
}
