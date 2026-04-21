part of 'localization_cubit.dart';

@immutable
sealed class LocalizationState {
  final Locale locale;

  const LocalizationState({required this.locale});
}

final class LocalizationInitial extends LocalizationState {
  const LocalizationInitial() : super(locale: const Locale('en'));
}

final class LocalizationChanged extends LocalizationState {
  const LocalizationChanged({required super.locale});
}
