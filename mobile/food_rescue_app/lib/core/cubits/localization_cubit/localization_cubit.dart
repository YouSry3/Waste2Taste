import 'dart:ui';

import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:waste2taste/core/constants/keys.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';

import '../../database/pref_service.dart';

part 'localization_state.dart';

class LocalizationCubit extends Cubit<LocalizationState> {
  LocalizationCubit() : super(LocalizationInitial()) {
    _loadSavedLanguage();
  }
  void _loadSavedLanguage() {
    final lang = getIt.get<PrefsService>().getString(kLocalizationKey) ?? 'en';
    emit(LocalizationChanged(locale: Locale(lang)));
  }

  Future<void> changeLanguage(String code) async {
    await getIt.get<PrefsService>().setString(kLocalizationKey, code);
    emit(LocalizationChanged(locale: Locale(code)));
  }
}
