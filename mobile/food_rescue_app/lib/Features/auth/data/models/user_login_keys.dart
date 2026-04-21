class UserLoginKeys {
  final String token;
  final String refreshToken;
  final int expireAt;

  const UserLoginKeys({
    required this.token,
    required this.refreshToken,
    required this.expireAt,
  });

  factory UserLoginKeys.fromJson(Map<String, dynamic> json) {
    return UserLoginKeys(
      token: json['token'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      expireAt: json['expireAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'token': token, 'refreshToken': refreshToken, 'expireAt': expireAt};
  }
}
