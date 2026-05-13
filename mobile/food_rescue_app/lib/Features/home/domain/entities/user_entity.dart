class UserEntity {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? imageUrl;
  final int orderCount;
  final double moneySpent;
  final double moneySaved;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.imageUrl,
    required this.orderCount,
    required this.moneySpent,
    required this.moneySaved,
  });

  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: json['role'],
      imageUrl: json['imageUrl'],
      orderCount: json['orderCount'],
      moneySpent: json['moneySpent'],
      moneySaved: json['moneySaved'],
    );
  }
}
