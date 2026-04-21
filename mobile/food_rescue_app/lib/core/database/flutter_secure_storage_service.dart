import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:waste2taste/Features/auth/data/models/user_login_keys.dart';

abstract class FlutterSecureStorageService {
  Future<void> saveAuthToken(UserLoginKeys userLoginKeys);

  Future<UserLoginKeys?> getAuthToken();

  Future<void> clearAuthToken();
}

class FlutterSecureStorageServiceImpl extends FlutterSecureStorageService {
  FlutterSecureStorageServiceImpl({required this.storage});
  final FlutterSecureStorage storage;

  static const _tokenKey = 'token';
  static const _refreshTokenKey = 'refreshToken';
  static const _expireAtKey = 'expireAt';

  @override
  Future<void> saveAuthToken(UserLoginKeys userLoginKeys) async {
    await storage.write(key: _tokenKey, value: userLoginKeys.token);
    await storage.write(
      key: _expireAtKey,
      value: userLoginKeys.expireAt.toString(),
    );
    await storage.write(
      key: _refreshTokenKey,
      value: userLoginKeys.refreshToken,
    );
  }

  @override
  Future<UserLoginKeys?> getAuthToken() async {
    final token = await storage.read(key: _tokenKey);
    final refreshToken = await storage.read(key: _refreshTokenKey);
    final expireAt = await storage.read(key: _expireAtKey);
    if (token == null || refreshToken == null || expireAt == null) {
      return null;
    }
    return UserLoginKeys(
      token: token,
      refreshToken: refreshToken,
      expireAt: int.parse(expireAt),
    );
  }

  @override
  Future<void> clearAuthToken() async {
    await storage.delete(key: _tokenKey);
    await storage.delete(key: _refreshTokenKey);
    await storage.delete(key: _expireAtKey);
  }
}
