import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/core/constants/keys.dart';
import 'package:waste2taste/core/cubits/localization_cubit/localization_cubit.dart';
import 'package:waste2taste/core/database/pref_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';

class MockPrefsService extends Mock implements PrefsService {}

void main() {
  late MockPrefsService mockPrefsService;

  setUp(() {
    mockPrefsService = MockPrefsService();
    if (getIt.isRegistered<PrefsService>()) {
      getIt.unregister<PrefsService>();
    }
    getIt.registerSingleton<PrefsService>(mockPrefsService);
  });

  tearDown(() async {
    await getIt.reset();
  });

  group('LocalizationCubit tests', () {
    blocTest<LocalizationCubit, LocalizationState>(
      'should load default language en when preference is null',
      setUp: () {
        when(() => mockPrefsService.getString(kLocalizationKey)).thenReturn(null);
      },
      build: () => LocalizationCubit(),
      expect: () => [],
      verify: (cubit) {
        expect(cubit.state, isA<LocalizationChanged>());
        expect((cubit.state as LocalizationChanged).locale.languageCode, 'en');
      },
    );

    blocTest<LocalizationCubit, LocalizationState>(
      'should load saved language from preferences on startup',
      setUp: () {
        when(() => mockPrefsService.getString(kLocalizationKey)).thenReturn('ar');
      },
      build: () => LocalizationCubit(),
      expect: () => [],
      verify: (cubit) {
        expect(cubit.state, isA<LocalizationChanged>());
        expect((cubit.state as LocalizationChanged).locale.languageCode, 'ar');
      },
    );

    blocTest<LocalizationCubit, LocalizationState>(
      'changeLanguage should persist selection and emit new locale state',
      setUp: () {
        when(() => mockPrefsService.getString(kLocalizationKey)).thenReturn('en');
        when(() => mockPrefsService.setString(kLocalizationKey, 'ar')).thenAnswer((_) async => {});
      },
      build: () => LocalizationCubit(),
      act: (cubit) async {
        await cubit.changeLanguage('ar');
      },
      expect: () => [
        isA<LocalizationChanged>().having((s) => s.locale.languageCode, 'locale', 'ar'),
      ],
      verify: (cubit) {
        verify(() => mockPrefsService.setString(kLocalizationKey, 'ar')).called(1);
      },
    );
  });
}
