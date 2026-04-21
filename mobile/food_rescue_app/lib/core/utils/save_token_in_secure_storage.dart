import '../../Features/auth/data/models/user_login_keys.dart';
import '../database/flutter_secure_storage_service.dart';
import '../functions/setup_service_locator.dart';

Future<void> saveDataInSecureStorage(UserLoginKeys userLoginKeys) async {
  await getIt.get<FlutterSecureStorageService>().saveAuthToken(userLoginKeys);
}
