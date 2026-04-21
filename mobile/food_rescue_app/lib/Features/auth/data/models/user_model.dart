import '../../domain/entities/user_entity.dart';
import 'user_login_keys.dart';

class UserModel extends UserEntity {
  UserModel({
    required super.email,
    required super.name,
    required super.role,
    super.userImg,
    required super.userLoginKeys,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      email: json['email'],
      name: json['name'],
      role: json['role'],
      userImg: json['imageUrl'] ,
      userLoginKeys: UserLoginKeys.fromJson(json),
    );
  }
}
