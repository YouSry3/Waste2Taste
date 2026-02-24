import 'package:get_it/get_it.dart';
import '../../Features/splash/data/repos/onboarding_repo_impl.dart';
import '../../Features/splash/domain/repos/onboarding_repo.dart';

GetIt getIt = GetIt.instance;

void setupLocator() {
  getIt.registerLazySingleton<OnboardingRepo>(() => OnboardingRepoImpl());
}
