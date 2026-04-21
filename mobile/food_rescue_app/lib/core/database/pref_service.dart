import 'package:shared_preferences/shared_preferences.dart';

class PrefsService {
  final SharedPreferences _instance;

  PrefsService(this._instance);

  void setBool(String key, bool value) {
    _instance.setBool(key, value);
  }

  bool getBool(String key) {
    return _instance.getBool(key) ?? false;
  }

  Future<void> setString(String key, String value) async {
    await _instance.setString(key, value);
  }

  String? getString(String key) {
    return _instance.getString(key);
  }

  Future<bool> removeData({required String key}) async {
    return await _instance.remove(key);
  }
}
