class UserEntity {
  final String email;
  final String name;
  final String type;

  const UserEntity({
    required this.email,
    required this.name,
    this.type = 'customer',
  });
}
