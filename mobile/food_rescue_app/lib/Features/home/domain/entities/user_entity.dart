class UserEntity {
  final String name;
  final String email;
  final String role;
  final String? imageUrl;
  final int orderCount;
  final double moneySpent;
  final double moneySaved;

  const UserEntity({
    required this.name,
    required this.email,
    required this.role,
    this.imageUrl,
    required this.orderCount,
    required this.moneySpent,
    required this.moneySaved,
  });
}
