import '../entities/onboarding_entity.dart';

abstract class OnboardingRepo {
  List<OnboardingEntity> getPages();
}
