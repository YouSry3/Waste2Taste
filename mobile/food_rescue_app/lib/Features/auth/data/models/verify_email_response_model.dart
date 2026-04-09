class VerifyEmailResponseModel {
  final String message;

  const VerifyEmailResponseModel({required this.message});

  factory VerifyEmailResponseModel.fromJson(Map<String, dynamic> json) {
    return VerifyEmailResponseModel(message: json['message']);
  }
  Map<String, dynamic> toJson() {
    return {'message': message};
  }
}
