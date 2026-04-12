import 'package:get_it/get_it.dart';
import 'package:waste2taste/Features/auth/data/data_sources/auth_remote_data_source.dart';
import 'package:waste2taste/Features/auth/data/repos/auth_repo_impl.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/reset_pass_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/send_reset_password_code_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/signup_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/verify_email_usecase.dart';
import '../../Features/splash/data/repos/onboarding_repo_impl.dart';
import '../../Features/splash/domain/repos/onboarding_repo.dart';
import '../services/api_service.dart';
import '../theme/theme_cubit.dart';

GetIt getIt = GetIt.instance;

void setupServiceLocator() {
  getIt.registerLazySingleton<ThemeCubit>(() => ThemeCubit());
  getIt.registerLazySingleton<OnboardingRepo>(() => OnboardingRepoImpl());
  getIt.registerLazySingleton<ApiService>(() => ApiService());
  getIt.registerLazySingleton<AuthRepoImpl>(
    () => AuthRepoImpl(
      authRemoteDataSource: AuthRemoteDataSourceImpl(getIt.get<ApiService>()),
    ),
  );
  getIt.registerLazySingleton<SignupUsecase>(
    () => SignupUsecase(authRepo: getIt.get<AuthRepoImpl>()),
  );
  getIt.registerLazySingleton<SendResetPasswordCodeUsecase>(
    () => SendResetPasswordCodeUsecase(authRepo: getIt.get<AuthRepoImpl>()),
  );
  getIt.registerLazySingleton<VerifyEmailUsecase>(
    () => VerifyEmailUsecase(authRepo: getIt.get<AuthRepoImpl>()),
  );
  getIt.registerLazySingleton<ResetPassUsecase>(
    () => ResetPassUsecase(authRepo: getIt.get<AuthRepoImpl>()),
  );
}
