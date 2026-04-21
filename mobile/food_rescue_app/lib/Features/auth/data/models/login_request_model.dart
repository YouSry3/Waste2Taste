class LoginRequestModel {
  final String email;
  final String password;
  
  const LoginRequestModel({required this.email, required this.password});

  Map<String, dynamic> toJson() {
    return {'email': email, 'password': password};
  }
  factory LoginRequestModel.fromJson(Map<String, dynamic> json) {
    return LoginRequestModel(
      email: json['email'] ?? '',
      password: json['password'] ?? '',
    );
  }
}
