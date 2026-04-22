import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:waste2taste/Features/auth/data/data_sources/auth_remote_data_source.dart';
import 'package:waste2taste/Features/auth/data/repos/auth_repo_impl.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/login_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/reset_pass_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/send_reset_password_code_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/signup_usecase.dart';
import 'package:waste2taste/Features/auth/domain/use_cases/verify_email_usecase.dart';
import '../../Features/home/data/data_sources/home_remote_data_source.dart';
import '../../Features/home/data/repos/home_repo_impl.dart';
import '../../Features/home/domain/use_cases/get_profile_usecase.dart';
import '../../Features/home/domain/use_cases/get_user_location_usecase.dart';
import '../../Features/home/domain/use_cases/get_products_usecase.dart';
import '../../Features/profile/data/datasources/profile_remote_data_source.dart';
import '../../Features/profile/data/repos/profile_repo_impl.dart';
import '../../Features/profile/domain/usecases/edit_profile_usecase.dart';
import '../../Features/profile/domain/usecases/change_password_usecase.dart';

import '../../Features/splash/data/repos/onboarding_repo_impl.dart';
import '../../Features/splash/domain/repos/onboarding_repo.dart';
import '../database/flutter_secure_storage_service.dart';
import '../database/pref_service.dart';
import '../services/api_service.dart';
import '../cubits/theme_cubit/theme_cubit.dart';
import '../services/location_service.dart';

GetIt getIt = GetIt.instance;

Future<void> setupServiceLocator() async {
  final pref = await SharedPreferences.getInstance();
  getIt.registerLazySingleton<SharedPreferences>(() => pref);
  getIt.registerLazySingleton<PrefsService>(
    () => PrefsService(getIt.get<SharedPreferences>()),
  );
  getIt.registerLazySingleton<LocationService>(() => LocationService());

  getIt.registerLazySingleton<FlutterSecureStorage>(
    () => FlutterSecureStorage(),
  );
  getIt.registerLazySingleton<FlutterSecureStorageService>(
    () => FlutterSecureStorageServiceImpl(
      storage: getIt.get<FlutterSecureStorage>(),
    ),
  );

  getIt.registerLazySingleton<ThemeCubit>(() => ThemeCubit());
  getIt.registerLazySingleton<OnboardingRepo>(() => OnboardingRepoImpl());
  getIt.registerLazySingleton<ApiService>(() => ApiService());
  getIt.registerLazySingleton<AuthRepoImpl>(
    () => AuthRepoImpl(
      authRemoteDataSource: AuthRemoteDataSourceImpl(getIt.get<ApiService>()),
    ),
  );

  ///usecases
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
  getIt.registerLazySingleton<LoginUsecase>(
    () => LoginUsecase(authRepo: getIt.get<AuthRepoImpl>()),
  );
  getIt.registerLazySingleton<HomeRemoteDataSource>(
    () => HomeRemoteDataSourceImpl(getIt.get<ApiService>()),
  );
  getIt.registerLazySingleton<HomeRepoImpl>(
    () => HomeRepoImpl(homeRemoteDataSource: getIt.get<HomeRemoteDataSource>()),
  );
  getIt.registerLazySingleton<GetProfileUsecase>(
    () => GetProfileUsecase(homeRepo: getIt.get<HomeRepoImpl>()),
  );
  getIt.registerLazySingleton<GetUserLocationUsecase>(
    () => GetUserLocationUsecase(locationService: getIt.get<LocationService>()),
  );
  getIt.registerLazySingleton<GetProductsUsecase>(
    () => GetProductsUsecase(homeRepo: getIt.get<HomeRepoImpl>()),
  );
  getIt.registerLazySingleton<ProfileRemoteDataSource>(
    () => ProfileRemoteDataSourceImpl(getIt.get<ApiService>()),
  );
  getIt.registerLazySingleton<ProfileRepoImpl>(
    () => ProfileRepoImpl(profileRemoteDataSource: getIt.get<ProfileRemoteDataSource>()),
  );
  getIt.registerLazySingleton<EditProfileUsecase>(
    () => EditProfileUsecase(profileRepo: getIt.get<ProfileRepoImpl>()),
  );
  getIt.registerLazySingleton<ChangePasswordUsecase>(
    () => ChangePasswordUsecase(getIt.get<ProfileRepoImpl>()),
  );
}
