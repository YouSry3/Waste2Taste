class SignupResponseModel {
  final String email;
  final String name;
  final String role;

  const SignupResponseModel({
    required this.email,
    required this.name,
    required this.role,
  });
  factory SignupResponseModel.fromJson(Map<String, dynamic> json) {
    return SignupResponseModel(
      email: json['email'],
      name: json['name'],
      role: json['role'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'email': email, 'name': name, 'role': role};
  }
}
