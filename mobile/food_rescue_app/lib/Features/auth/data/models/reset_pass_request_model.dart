class ResetPassRequestModel {
  final String email;
  final String code;
  final String newPassword;

  ResetPassRequestModel({
    required this.email,
    required this.code,
    required this.newPassword,
  });

  factory ResetPassRequestModel.fromJson(Map<String, dynamic> json) {
    return ResetPassRequestModel(
      email: json["email"],
      code: json["code"],
      newPassword: json["newpassword"],
    );
  }
  Map<String, dynamic> toJson() {
    return {"email": email, "code": code, "newpassword": newPassword};
  }
}
