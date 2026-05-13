import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    required super.role,
    super.imageUrl,
    required super.orderCount,
    required super.moneySpent,
    required super.moneySaved,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? '',
      imageUrl: json['imageUrl'],
      orderCount: json['orderCount'] ?? 0,
      moneySpent: (json['moneySpent'] ?? 0).toDouble(),
      moneySaved: (json['moneySaved'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'imageUrl': imageUrl,
      'orderCount': orderCount,
      'moneySpent': moneySpent,
      'moneySaved': moneySaved,
    };
  }
}
