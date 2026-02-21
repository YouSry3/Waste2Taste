import 'package:food_rescue_app/Features/splash/data/repos/onboarding_repo_impl.dart';
import 'package:get_it/get_it.dart';

import '../../Features/splash/domain/repos/onboarding_repo.dart';

GetIt getIt = GetIt.instance;

void setupLocator() {
  getIt.registerLazySingleton<OnboardingRepo>(() => OnboardingRepoImpl());
}
