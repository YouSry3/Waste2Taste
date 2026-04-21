class SignupRequestModel {
  final String email;
  final String password;
  final String name;
  final String type = "customer";
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
      "type": type,
      "PhoneNumber": phoneNumber,
    };
  }
}
