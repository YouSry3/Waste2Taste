import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:waste2taste/core/constants/keys.dart';
import 'package:waste2taste/core/cubits/theme_cubit/theme_cubit.dart';
import 'package:waste2taste/core/database/pref_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';

class MockPrefsService extends Mock implements PrefsService {}

void main() {
  late MockPrefsService mockPrefsService;

  setUp(() {
    mockPrefsService = MockPrefsService();
    // Register mockPrefsService inside getIt singleton locator
    if (getIt.isRegistered<PrefsService>()) {
      getIt.unregister<PrefsService>();
    }
    getIt.registerSingleton<PrefsService>(mockPrefsService);
  });

  tearDown(() async {
    await getIt.reset();
  });

  group('ThemeCubit tests', () {
    blocTest<ThemeCubit, ThemeState>(
      'should load light theme as initial state when prefs says false',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(false);
      },
      build: () => ThemeCubit(),
      expect: () => [],
      verify: (cubit) {
        expect(cubit.state.themeMode, AppThemeMode.light);
      },
    );

    blocTest<ThemeCubit, ThemeState>(
      'should load dark theme as initial state when prefs says true',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(true);
      },
      build: () => ThemeCubit(),
      expect: () => [],
      verify: (cubit) {
        expect(cubit.state.themeMode, AppThemeMode.dark);
      },
    );

    blocTest<ThemeCubit, ThemeState>(
      'setTheme should emit new theme state and persist to PrefsService',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(false);
      },
      build: () => ThemeCubit(),
      act: (cubit) {
        cubit.setTheme(AppThemeMode.dark);
      },
      expect: () => [
        isA<ThemeState>().having((s) => s.themeMode, 'themeMode', AppThemeMode.dark),
      ],
      verify: (cubit) {
        verify(() => mockPrefsService.setBool(kDarkLightKey, true)).called(1);
      },
    );

    blocTest<ThemeCubit, ThemeState>(
      'setTheme should not emit or persist when same theme is selected',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(false);
      },
      build: () => ThemeCubit(),
      act: (cubit) {
        cubit.setTheme(AppThemeMode.light);
      },
      expect: () => [],
      verify: (cubit) {
        verifyNever(() => mockPrefsService.setBool(any(), any()));
      },
    );

    blocTest<ThemeCubit, ThemeState>(
      'toggleTheme should toggle current theme from light to dark',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(false);
      },
      build: () => ThemeCubit(),
      act: (cubit) async {
        await cubit.toggleTheme();
      },
      expect: () => [
        isA<ThemeState>().having((s) => s.themeMode, 'themeMode', AppThemeMode.dark),
      ],
      verify: (cubit) {
        verify(() => mockPrefsService.setBool(kDarkLightKey, true)).called(1);
      },
    );

    blocTest<ThemeCubit, ThemeState>(
      'toggleTheme should toggle current theme from dark to light',
      setUp: () {
        when(() => mockPrefsService.getBool(kDarkLightKey)).thenReturn(true);
      },
      build: () => ThemeCubit(),
      act: (cubit) async {
        await cubit.toggleTheme();
      },
      expect: () => [
        isA<ThemeState>().having((s) => s.themeMode, 'themeMode', AppThemeMode.light),
      ],
      verify: (cubit) {
        verify(() => mockPrefsService.setBool(kDarkLightKey, false)).called(1);
      },
    );
  });
}
