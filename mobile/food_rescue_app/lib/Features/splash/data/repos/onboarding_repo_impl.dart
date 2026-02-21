import 'package:food_rescue_app/Features/splash/domain/entities/onboarding_entity.dart';

import '../../domain/repos/onboarding_repo.dart';
import '../models/onboarding_model.dart';

class OnboardingRepoImpl implements OnboardingRepo {
  @override
  List<OnboardingEntity> getPages() => [
    OnboardingModel(
      title: "Rescue Great Food",
      description:
          "Find quality meals at up to 70% off while helping protect the planet.",
      iconName: 'utensils',
      colorName: 'primary',
    ),
    OnboardingModel(
      title: "Premium Meals. Better Prices.",
      description:
          "Enjoy fresh, high-quality food at amazing discounts. Reserve in seconds.",
      iconName: 'shoppingBag',
      colorName: 'secondary',
    ),
    OnboardingModel(
      title: "Join the Food Rescue Movement",
      description:
          "Save money, reduce waste, and turn everyday meals into real impact.",
      iconName: 'heart',
      colorName: 'accent',
    ),
  ];
}
