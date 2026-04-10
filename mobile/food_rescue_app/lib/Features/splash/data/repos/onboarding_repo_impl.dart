import '../../../../core/enums/color_name.dart';
import '../../../../core/enums/icon_name.dart';
import '../../domain/repos/onboarding_repo.dart';
import '../models/onboarding_model.dart';

class OnboardingRepoImpl implements OnboardingRepo {
  @override
  List<OnboardingModel> getPages() => [
    OnboardingModel(
      titleKey: "rescueFoodTitle",
      descriptionKey: "rescueFoodDesc",
      iconName: IconName.utensils,
      colorName: ColorName.primary,
    ),
    OnboardingModel(
      titleKey: "premiumMealsTitle",
      descriptionKey: "premiumMealsDesc",
      iconName: IconName.shoppingBag,
      colorName: ColorName.secondary,
    ),
    OnboardingModel(
      titleKey: "joinMovementTitle",
      descriptionKey: "joinMovementDesc",
      iconName: IconName.heart,
      colorName: ColorName.accent,
    ),
  ];
}
