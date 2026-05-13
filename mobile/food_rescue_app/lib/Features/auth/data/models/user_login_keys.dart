class UserLoginKeys {
  final String token;
  final String refreshToken;
  final DateTime expireAt;
  final String userId;

  const UserLoginKeys({
    required this.token,
    required this.refreshToken,
    required this.expireAt,
    required this.userId,
  });

  factory UserLoginKeys.fromJson(Map<String, dynamic> json) {
    return UserLoginKeys(
      token: json['token'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      expireAt: DateTime.now().add(Duration(seconds: json['expireAt'])),
      userId: json['id'] ?? '',
    );
  }
  factory UserLoginKeys.fromStorage(Map<String, dynamic> json) {
    return UserLoginKeys(
      token: json['token'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      expireAt: DateTime.parse(json['expireAt']),
      userId: json['id'] ?? '',
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'refreshToken': refreshToken,
      'expireAt': expireAt.toIso8601String(),
      'id': userId,
    };
  }

  bool get isExpired => DateTime.now().isAfter(expireAt);
  bool get isValid => !isExpired;
}
