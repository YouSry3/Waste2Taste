class VerifyEmailRequestModel {
  final String email;
  final String code;

  const VerifyEmailRequestModel({required this.email, required this.code});

  Map<String, dynamic> toJson() {
    return {'email': email, 'code': code};
  }
}
