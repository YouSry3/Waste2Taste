class ResetPassResponseModel {
  final String message;

  const ResetPassResponseModel({required this.message});

  factory ResetPassResponseModel.fromJson(Map<String, dynamic> json) {
    return ResetPassResponseModel(message: json['message']);
  }

  Map<String, dynamic> toJson() {
    return {'message': message};
  }
}
