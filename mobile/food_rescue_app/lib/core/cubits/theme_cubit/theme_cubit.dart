import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';

import '../../constants/keys.dart';
import '../../database/pref_service.dart';
part 'theme_state.dart';

class ThemeCubit extends Cubit<ThemeState> {
  ThemeCubit() : super(const ThemeState(AppThemeMode.light)) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final isDark = getIt.get<PrefsService>().getBool(kDarkLightKey);
    emit(ThemeState(isDark ? AppThemeMode.dark : AppThemeMode.light));
  }

  void setTheme(AppThemeMode mode) {
    if (state.themeMode == mode) return;
    getIt.get<PrefsService>().setBool(kDarkLightKey, mode == AppThemeMode.dark);
    emit(ThemeState(mode));
  }

  Future<void> toggleTheme() async {
    final isDark = state.themeMode == AppThemeMode.dark;
    getIt.get<PrefsService>().setBool(kDarkLightKey, !isDark);
    emit(ThemeState(isDark ? AppThemeMode.light : AppThemeMode.dark));
  }
}
