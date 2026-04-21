import '../../data/models/user_login_keys.dart';

class UserEntity {
  final String email;
  final String name;
  final String? userImg;
  final String role;
  final UserLoginKeys userLoginKeys;

  const UserEntity({
    required this.email,
    required this.name,
    this.role = 'customer',
    this.userImg,
    required this.userLoginKeys,
  });
}
