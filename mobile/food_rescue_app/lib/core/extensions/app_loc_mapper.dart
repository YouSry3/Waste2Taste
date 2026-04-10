import '../l10n/app_localizations.dart';

extension AppLocalizationsExt on AppLocalizations {
  String getString(String key) {
    switch (key) {
      case "rescueFoodTitle":
        return rescueFoodTitle;
      case "rescueFoodDesc":
        return rescueFoodDesc;
      case "premiumMealsTitle":
        return premiumMealsTitle;
      case "premiumMealsDesc":
        return premiumMealsDesc;
      case "joinMovementTitle":
        return joinMovementTitle;
      case "joinMovementDesc":
        return joinMovementDesc;
      default:
        return key;
    }
  }
}
