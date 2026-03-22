class SignupRequestModel {
  final String email;
  final String password;
  final String name;
  final String type = "customer";

  SignupRequestModel({
    required this.email,
    required this.password,
    required this.name,
  });

  Map<String, dynamic> toJson() {
    return {"email": email, "password": password, "name": name, "type": type};
  }
}
