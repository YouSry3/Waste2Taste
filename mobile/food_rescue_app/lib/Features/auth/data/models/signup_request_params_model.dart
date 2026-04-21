class SignupRequestModel {
  final String email;
  final String password;
  final String name;
  final String role = "customer";
  final String phoneNumber;

  SignupRequestModel({
    required this.email,
    required this.password,
    required this.name,
    required this.phoneNumber,
  });

  Map<String, dynamic> toJson() {
    return {
      "email": email,
      "password": password,
      "name": name,
      "role": role,
      "PhoneNumber": phoneNumber,
    };
  }
}
